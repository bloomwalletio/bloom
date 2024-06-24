<script lang="ts">
    import { buildSupportedNamespacesFromSelections, connectToDapp } from '@auxiliary/wallet-connect/actions'
    import { ALL_SUPPORTED_METHODS, SUPPORTED_EVENTS } from '@auxiliary/wallet-connect/constants'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import {
        clearSessionInitiationRequest,
        getPersistedDappNamespacesForDapp,
        sessionInitiationRequest,
    } from '@auxiliary/wallet-connect/stores'
    import { ISupportedNamespace, SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { getCaip10AddressForAccount, rejectAndClearSessionInitiationRequest } from '@auxiliary/wallet-connect/utils'
    import { Button, Spinner, Table } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { time } from '@core/app/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { getEvmNetworks } from '@core/network'
    import { activeAccounts } from '@core/profile/stores'
    import { Router } from '@core/router'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { DappInfo } from '@ui'
    import {
        AccountSelection,
        ConnectionSummary,
        NetworkSelection,
        PermissionSelection,
        ConnectionRequestExpirationAlert,
    } from '../components'
    import { DappConfigRoute } from '../dapp-config-route.enum'

    export let drawerRouter: Router<unknown>

    let loading = false

    enum Selection {
        Summary = 'summary',
        Accounts = 'accounts',
        Permissions = 'permissions',
        Networks = 'networks',
    }

    let activeSelection: Selection = Selection.Summary
    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'

    $: verifiedState = $sessionInitiationRequest?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : ($sessionInitiationRequest?.verifyContext.verified.validation as DappVerification)

    $: hasRequestExpired = $sessionInitiationRequest?.params.expiryTimestamp
        ? $sessionInitiationRequest.params.expiryTimestamp - $time.getTime() / MILLISECONDS_PER_SECOND <= 0
        : false

    let checkedAccounts: IAccountState[] = []
    let checkedNetworks: string[] = []
    let checkedMethods: string[] = []
    let supportedNamespaces = initSupportedNamespaces()

    function initSupportedNamespaces(): SupportedNamespaces {
        if (!$sessionInitiationRequest) {
            return {}
        }

        const persistedNamespaces = $sessionInitiationRequest
            ? getPersistedDappNamespacesForDapp($sessionInitiationRequest.params.proposer.metadata.url)
            : undefined

        if (persistedNamespaces) {
            return persistedNamespaces.supported
        }

        const { requiredNamespaces, optionalNamespaces } = $sessionInitiationRequest.params

        const allChainids = [...Object.values(requiredNamespaces), ...Object.values(optionalNamespaces)]
            .flatMap(({ chains }) => chains)
            .filter(Boolean) as string[]

        const namespace: Record<string, ISupportedNamespace> = {}
        for (const network of getEvmNetworks()) {
            if (!allChainids.includes(network.id)) {
                continue
            }

            if (!namespace[network.namespace]) {
                const accounts = $activeAccounts
                    .map((account) => getCaip10AddressForAccount(account, network.id) as string)
                    .filter(Boolean)

                namespace[network.namespace] = {
                    chains: [],
                    methods: ALL_SUPPORTED_METHODS,
                    events: SUPPORTED_EVENTS,
                    accounts,
                }
            }

            namespace[network.namespace].chains.push(network.id)
        }
        return namespace
    }

    function updateSupportedNamespaces(): void {
        if (!$sessionInitiationRequest || activeSelection === Selection.Summary) {
            return
        }

        const { requiredNamespaces, optionalNamespaces } = $sessionInitiationRequest.params

        const selections = {
            chains: checkedNetworks,
            methods: checkedMethods,
            accounts: checkedAccounts,
        }

        supportedNamespaces = buildSupportedNamespacesFromSelections(
            selections,
            requiredNamespaces,
            optionalNamespaces,
            supportedNamespaces
        )
    }

    function onCancelClick(): void {
        void rejectAndClearSessionInitiationRequest()
        closeDrawer()
    }

    async function onConfirmClick(): Promise<void> {
        if (!$sessionInitiationRequest) {
            return
        }

        try {
            loading = true
            await connectToDapp(supportedNamespaces, $sessionInitiationRequest, $selectedAccount as IAccountState)
            clearSessionInitiationRequest()

            drawerRouter.reset()
            drawerRouter.goTo(DappConfigRoute.ConnectedDapps)
        } catch (error) {
            loading = false
            handleError(error)
        }
    }
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter} showBack={false}>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        {#if $sessionInitiationRequest}
            {@const requiredNamespaces = $sessionInitiationRequest.params.requiredNamespaces}
            {@const optionalNamespaces = $sessionInitiationRequest.params.optionalNamespaces}
            {@const metadata = $sessionInitiationRequest.params.proposer.metadata}

            <div>
                <DappInfo metadata={$sessionInitiationRequest.params.proposer.metadata} {verifiedState} />
                <ConnectionRequestExpirationAlert expiryTimestamp={$sessionInitiationRequest.params.expiryTimestamp} />
            </div>

            <div class="px-6 flex-grow overflow-hidden">
                {#if activeSelection === Selection.Summary}
                    <div class="h-full overflow-auto space-y-6">
                        <Table
                            items={[
                                {
                                    key: localize('general.description'),
                                    value: metadata.description,
                                },
                            ]}
                            orientation="vertical"
                        />
                        <ConnectionSummary
                            {requiredNamespaces}
                            editable
                            {supportedNamespaces}
                            onEditPermissionsClick={() =>
                                !loading || !hasRequestExpired ? (activeSelection = Selection.Permissions) : undefined}
                            onEditNetworksClick={() =>
                                !loading || !hasRequestExpired ? (activeSelection = Selection.Networks) : undefined}
                            onEditAccountsClick={() =>
                                !loading || !hasRequestExpired ? (activeSelection = Selection.Accounts) : undefined}
                        />
                    </div>
                {:else}
                    <div class="flex-grow {activeSelection === Selection.Permissions ? 'visible' : 'hidden'}">
                        <PermissionSelection
                            bind:checkedMethods
                            {requiredNamespaces}
                            {optionalNamespaces}
                            {supportedNamespaces}
                        />
                    </div>
                    <div class="flex-grow {activeSelection === Selection.Networks ? 'visible' : 'hidden'}">
                        <NetworkSelection
                            bind:checkedNetworks
                            {requiredNamespaces}
                            {optionalNamespaces}
                            {supportedNamespaces}
                        />
                    </div>
                    <div class="flex-grow {activeSelection === Selection.Accounts ? 'visible' : 'hidden'}">
                        <AccountSelection bind:checkedAccounts chainIds={checkedNetworks} {supportedNamespaces} />
                    </div>
                {/if}
            </div>
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        {/if}
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        {#if activeSelection === Selection.Summary}
            <Button
                variant="outlined"
                width="full"
                on:click={onCancelClick}
                disabled={loading}
                text={hasRequestExpired ? localize('actions.cancel') : localize('actions.reject')}
            />
            {#if !hasRequestExpired}
                <Button
                    width="full"
                    on:click={onConfirmClick}
                    disabled={loading}
                    busy={loading}
                    text={localize('actions.confirm')}
                />
            {/if}
        {:else}
            <Button
                variant="outlined"
                width="full"
                on:click={() => (activeSelection = Selection.Summary)}
                text={localize('actions.back')}
            />
            <Button
                width="full"
                on:click={() => {
                    updateSupportedNamespaces()
                    activeSelection = Selection.Summary
                }}
                text={localize('actions.apply')}
            />
        {/if}
    </div>
</DrawerTemplate>
