<script lang="ts">
    import { buildSupportedNamespacesFromSelections } from '@auxiliary/wallet-connect/actions'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { clearSessionInitiationRequest } from '@auxiliary/wallet-connect/stores'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import {
        getNetworksAndMethodsFromNamespaces,
        rejectAndClearSessionInitiationRequest,
    } from '@auxiliary/wallet-connect/utils'
    import { Button } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { IAccountState } from '@core/account'
    import { time } from '@core/app/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
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
    import { CoreTypes, ProposalTypes } from '@walletconnect/types'
    import { IDappMetadata } from '@auxiliary/wallet-connect/interface'

    export let drawerRouter: Router<unknown>
    export let dappMetadata: CoreTypes.Metadata | IDappMetadata
    export let verifiedState: DappVerification
    export let expiryTimestamp: number
    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let optionalNamespaces: ProposalTypes.OptionalNamespaces
    export let supportedNamespaces: SupportedNamespaces

    export let confirmButtonLocaleKey: string
    export let onConfirm: (supportedNamespaces: SupportedNamespaces) => Promise<boolean>

    let loading = false

    enum Selection {
        Summary = 'summary',
        Accounts = 'accounts',
        Permissions = 'permissions',
        Networks = 'networks',
    }

    let activeSelection: Selection = Selection.Summary
    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'

    $: hasRequestExpired = expiryTimestamp ? expiryTimestamp - $time.getTime() / MILLISECONDS_PER_SECOND <= 0 : false

    let checkedAccounts: IAccountState[] = []
    let checkedNetworks: string[] = []
    let checkedMethods: string[] = []
    const { requiredNetworks, optionalNetworks, requiredMethods, optionalMethods } =
        getNetworksAndMethodsFromNamespaces(requiredNamespaces, optionalNamespaces)

    function updateSupportedNamespaces(): void {
        if (activeSelection === Selection.Summary) {
            return
        }

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
        try {
            loading = true
            const successful = await onConfirm(supportedNamespaces)
            if (successful) {
                clearSessionInitiationRequest()

                drawerRouter.reset()
                drawerRouter.goTo(DappConfigRoute.ConnectedDapps)
            }
        } catch (error) {
            loading = false
            handleError(error)
        }
    }
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter} showBack={false}>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        <div>
            <DappInfo metadata={dappMetadata} {verifiedState} />
            <ConnectionRequestExpirationAlert {expiryTimestamp} />
        </div>

        <div class="px-6 flex-grow overflow-hidden">
            {#if activeSelection === Selection.Summary}
                <div class="h-full overflow-auto space-y-6">
                    <slot />
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
                        {requiredMethods}
                        {optionalMethods}
                        {supportedNamespaces}
                    />
                </div>
                <div class="flex-grow {activeSelection === Selection.Networks ? 'visible' : 'hidden'}">
                    <NetworkSelection
                        bind:checkedNetworks
                        {requiredNetworks}
                        {optionalNetworks}
                        {supportedNamespaces}
                    />
                </div>
                <div class="flex-grow {activeSelection === Selection.Accounts ? 'visible' : 'hidden'}">
                    <AccountSelection bind:checkedAccounts chainIds={checkedNetworks} {supportedNamespaces} />
                </div>
            {/if}
        </div>
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
                    text={localize(confirmButtonLocaleKey)}
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
