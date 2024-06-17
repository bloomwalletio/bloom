<script lang="ts">
    import { Button, Spinner } from '@bloomwalletio/ui'
    import { DappInfo } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { connectToDapp } from '@auxiliary/wallet-connect/actions'
    import { getPersistedDappNamespacesForDapp, sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { rejectSession } from '@auxiliary/wallet-connect/utils'
    import { ConnectionSummary } from '../components'
    import { handleError } from '@core/error/handlers'
    import { IAccountState } from '@core/account'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { selectedAccount } from '@core/account/stores'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'

    export let drawerRouter: Router<unknown>

    let loading = false

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'

    $: verifiedState = $sessionProposal?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : ($sessionProposal?.verifyContext.verified.validation as DappVerification)

    const supportedNamespaces = initSupportedNamespaces()
    $: persistedNamespaces = $sessionProposal
        ? getPersistedDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url)
        : undefined

    function initSupportedNamespaces(): SupportedNamespaces {
        const persistedNamespaces = $sessionProposal
            ? getPersistedDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url)
            : undefined

        if (persistedNamespaces) {
            return persistedNamespaces.supported
        }
    }

    function onCancelClick(): void {
        if (drawerRouter.hasHistory()) {
            drawerRouter.previous()
        } else {
            rejectSession()
            closeDrawer()
        }
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

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        {#if $sessionProposal}
            {@const requiredNamespaces = $sessionProposal.params.requiredNamespaces}

            <DappInfo metadata={$sessionProposal.params.proposer.metadata} {verifiedState} />

            <div class="px-6 flex-grow overflow-hidden">
                {#if persistedNamespaces}
                    <div class="h-full overflow-scroll">
                        <ConnectionSummary {requiredNamespaces} editable {supportedNamespaces} {drawerRouter} />
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
        <Button
            variant="outlined"
            width="full"
            on:click={onCancelClick}
            disabled={loading}
            text={localize('actions.cancel')}
        />
        <Button
            width="full"
            on:click={onConfirmClick}
            disabled={loading}
            busy={loading}
            text={localize('actions.confirm')}
        />
    </div>
</DrawerTemplate>
