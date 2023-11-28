<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import {
        getPersistedDappNamespacesForDapp,
        persistDappNamespacesForDapp,
        selectedDapp,
        sessionProposal,
    } from '@auxiliary/wallet-connect/stores'
    import { onMount } from 'svelte'
    import { DappInformationCard, PermissionSelection } from '../components'
    import { buildSupportedNamespacesFromSelections } from '@auxiliary/wallet-connect/actions'
    import { updateSession } from '@auxiliary/wallet-connect/utils'

    export let drawerRouter: Router<unknown>

    const dappMetadata = $selectedDapp?.metadata ?? $sessionProposal?.params.proposer.metadata
    const persistedNamespaces = dappMetadata ? getPersistedDappNamespacesForDapp(dappMetadata.url) : undefined
    const requiredNamespaces = $selectedDapp?.session?.requiredNamespaces ?? $sessionProposal?.params.requiredNamespaces
    const optionalNamespaces = $selectedDapp?.session?.optionalNamespaces ?? $sessionProposal?.params.optionalNamespaces

    let checkedMethods: string[] = []

    function onConfirmClick(): void {
        const updatedNamespace = buildSupportedNamespacesFromSelections(
            { methods: checkedMethods },
            requiredNamespaces,
            optionalNamespaces,
            persistedNamespaces
        )
        persistDappNamespacesForDapp(dappMetadata.url, updatedNamespace)
        if ($selectedDapp?.session) {
            updateSession($selectedDapp.session.topic, updatedNamespace)
        }
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

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.editPermissions.title')} {drawerRouter}>
    <div class="w-full h-full flex flex-col">
        <DappInformationCard metadata={dappMetadata} />

        <div class="p-6 flex-grow overflow-hidden">
            <div class="h-full flex flex-col gap-8 overflow-scroll">
                <PermissionSelection bind:checkedMethods {requiredNamespaces} {persistedNamespaces} />
            </div>
        </div>
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button width="full" variant="outlined" on:click={onBackClick} text={localize('actions.back')} />
        <Button width="full" on:click={onConfirmClick} text={localize('actions.confirm')} />
    </div>
</DrawerTemplate>
