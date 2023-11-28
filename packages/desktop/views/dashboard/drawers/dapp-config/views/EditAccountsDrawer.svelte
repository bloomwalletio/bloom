<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { getPersistedDappNamespacesForDapp, selectedDapp, sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { onMount } from 'svelte'
    import { DappInformationCard, AccountSelection } from '../components'
    import { IAccountState } from '@core/account'

    export let drawerRouter: Router<unknown>

    const dappMetadata = $selectedDapp?.metadata ?? $sessionProposal?.params.proposer.metadata
    const persistedNamespaces = dappMetadata ? getPersistedDappNamespacesForDapp(dappMetadata?.url) : undefined

    let checkedAccounts: IAccountState[] = []

    function onConfirmClick(): void {
        // const updatedNamespace = buildSupportedNamespacesFromSelections(
        //     {
        //         chains: checkedNetworks,
        //         methods: ,
        //         accounts: checkedAccounts,
        //     },
        //     $sessionProposal.params.requiredNamespaces,
        //     $sessionProposal.params.optionalNamespaces
        // )
        // persistDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url, updatedNamespace)
        drawerRouter.previous()
    }

    function onBackClick(): void {
        drawerRouter.previous()
    }

    onMount(() => {
        if (!$selectedDapp && !$sessionProposal) {
            drawerRouter.previous()
        }
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.editAccounts.title')} {drawerRouter}>
    <div class="w-full h-full flex flex-col">
        <DappInformationCard metadata={dappMetadata} />

        <div class="p-6 flex-grow overflow-hidden">
            <div class="h-full flex flex-col gap-8 overflow-scroll">
                <AccountSelection bind:checkedAccounts {persistedNamespaces} />
            </div>
        </div>
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button width="full" variant="outlined" on:click={onBackClick} text={localize('actions.back')} />
        <Button width="full" on:click={onConfirmClick} text={localize('actions.confirm')} />
    </div>
</DrawerTemplate>
