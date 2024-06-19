<script lang="ts">
    import { Button, Spinner, Text } from '@bloomwalletio/ui'
    import { DappInfo } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { buildSupportedNamespacesFromSelections, connectToDapp } from '@auxiliary/wallet-connect/actions'
    import { getPersistedDappNamespacesForDapp, sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getCaip10AddressForAccount, rejectSession } from '@auxiliary/wallet-connect/utils'
    import { AccountSelection, ConnectionSummary, NetworkSelection, PermissionSelection } from '../components'
    import { handleError } from '@core/error/handlers'
    import { IAccountState } from '@core/account'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { selectedAccount } from '@core/account/stores'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { ISupportedNamespace, SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { getEvmNetworks } from '@core/network'
    import { ALL_SUPPORTED_METHODS, SUPPORTED_EVENTS } from '@auxiliary/wallet-connect/constants'
    import { activeAccounts } from '@core/profile/stores'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, getTimeDifference } from '@core/utils'
    import { time } from '@core/app/stores'

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

    $: verifiedState = $sessionProposal?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : ($sessionProposal?.verifyContext.verified.validation as DappVerification)

    $: expiryTimediff = $sessionProposal
        ? $sessionProposal.params.expiryTimestamp * MILLISECONDS_PER_SECOND - $time.getTime()
        : 0

    let checkedAccounts: IAccountState[] = []
    let checkedNetworks: string[] = []
    let checkedMethods: string[] = []
    let supportedNamespaces = initSupportedNamespaces()

    function initSupportedNamespaces(): SupportedNamespaces {
        if (!$sessionProposal) {
            return {}
        }

        const persistedNamespaces = $sessionProposal
            ? getPersistedDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url)
            : undefined

        if (persistedNamespaces) {
            return persistedNamespaces.supported
        }

        const { requiredNamespaces, optionalNamespaces } = $sessionProposal.params

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
        if (!$sessionProposal || activeSelection === Selection.Summary) {
            return
        }

        const { requiredNamespaces, optionalNamespaces } = $sessionProposal.params

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
        if (expiryTimediff < 0) {
            rejectSession()
        }
        closeDrawer()
    }

    async function onConfirmClick(): Promise<void> {
        if (!$sessionProposal) {
            return
        }

        try {
            loading = true
            await connectToDapp(supportedNamespaces, $sessionProposal, $selectedAccount as IAccountState)
            $sessionProposal = undefined

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
        {#if $sessionProposal}
            {@const requiredNamespaces = $sessionProposal.params.requiredNamespaces}
            {@const optionalNamespaces = $sessionProposal.params.optionalNamespaces}

            <div>
                <DappInfo metadata={$sessionProposal.params.proposer.metadata} {verifiedState} />

                {#if expiryTimediff <= 0}
                    <div class="w-full flex gap-4 px-6 py-1 bg-danger dark:bg-danger-dark">
                        <Text type="sm" class="flex items-center">Connection request expired</Text>
                    </div>
                {:else}
                    <div
                        class="w-full flex gap-4 px-6 py-1 {expiryTimediff <
                        SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
                            ? 'bg-warning dark:bg-warning-dark'
                            : 'bg-surface-2 dark:bg-surface-2-dark'}"
                    >
                        <Text type="sm" class="flex items-center">Connection request expires in</Text>
                        <Text type="base" class="flex-grow">
                            {getTimeDifference(
                                new Date($sessionProposal.params.expiryTimestamp * MILLISECONDS_PER_SECOND),
                                $time
                            )}
                        </Text>
                    </div>
                {/if}
            </div>

            <div class="px-6 flex-grow overflow-hidden">
                {#if activeSelection === Selection.Summary}
                    {@const isExpired = expiryTimediff <= 0}
                    <div class="h-full overflow-auto">
                        <ConnectionSummary
                            {requiredNamespaces}
                            editable
                            {supportedNamespaces}
                            onEditPermissionsClick={() =>
                                !loading || !isExpired ? (activeSelection = Selection.Permissions) : undefined}
                            onEditNetworksClick={() =>
                                !loading || !isExpired ? (activeSelection = Selection.Networks) : undefined}
                            onEditAccountsClick={() =>
                                !loading || !isExpired ? (activeSelection = Selection.Accounts) : undefined}
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
                text={localize('actions.reject')}
            />
            <Button
                width="full"
                on:click={onConfirmClick}
                disabled={loading || expiryTimediff <= 0}
                busy={loading}
                text={localize('actions.confirm')}
            />
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
