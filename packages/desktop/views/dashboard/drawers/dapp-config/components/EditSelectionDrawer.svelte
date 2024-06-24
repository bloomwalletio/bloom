<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import {
        updateSupportedDappNamespacesForDapp,
        selectedDapp,
        sessionInitiationRequest,
        getPersistedDapp,
    } from '@auxiliary/wallet-connect/stores'
    import { onMount } from 'svelte'
    import { buildSupportedNamespacesFromSelections } from '@auxiliary/wallet-connect/actions'
    import { updateSession } from '@auxiliary/wallet-connect/utils'
    import { IDappMetadata, ISelections } from '@auxiliary/wallet-connect/interface'
    import { DappInfo } from '@ui'

    export let drawerRouter: Router<unknown>
    export let selections: ISelections
    export let titleLocale: string
    export let disableContinue: boolean

    $: dappMetadata = $selectedDapp?.metadata ?? ($sessionInitiationRequest?.params.proposer.metadata as IDappMetadata)
    $: persistedDapp = dappMetadata ? getPersistedDapp(dappMetadata.url) : undefined
    $: requiredNamespaces =
        $selectedDapp?.session?.requiredNamespaces ?? $sessionInitiationRequest?.params.requiredNamespaces ?? {}
    $: optionalNamespaces =
        $selectedDapp?.session?.optionalNamespaces ?? $sessionInitiationRequest?.params.optionalNamespaces ?? {}

    function onConfirmClick(): void {
        const updatedNamespace = buildSupportedNamespacesFromSelections(
            selections,
            requiredNamespaces,
            optionalNamespaces,
            persistedDapp?.namespaces.supported
        )
        updateSupportedDappNamespacesForDapp(dappMetadata.url, updatedNamespace)
        if ($selectedDapp?.session) {
            updateSession($selectedDapp.session.topic, updatedNamespace)
        }
        drawerRouter.previous()
    }

    function onBackClick(): void {
        drawerRouter.previous()
    }

    onMount(() => {
        if (!$selectedDapp && !$sessionInitiationRequest) {
            drawerRouter.previous()
        }
    })
</script>

<DrawerTemplate title={localize(`views.dashboard.drawers.${titleLocale}.title`)} {drawerRouter}>
    <div class="w-full h-full flex flex-col">
        <DappInfo metadata={dappMetadata} verifiedState={persistedDapp?.verificationState} />

        <div class="p-6 flex-grow overflow-hidden">
            <div class="h-full flex flex-col gap-8 overflow-scroll">
                <slot
                    persistedSupportedNamespaces={persistedDapp?.namespaces.supported}
                    {requiredNamespaces}
                    {optionalNamespaces}
                />
            </div>
        </div>
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button width="full" variant="outlined" on:click={onBackClick} text={localize('actions.back')} />
        <Button width="full" on:click={onConfirmClick} disabled={disableContinue} text={localize('actions.confirm')} />
    </div>
</DrawerTemplate>
