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
        SessionInitiationRequest,
    } from '@auxiliary/wallet-connect/stores'
    import { onMount } from 'svelte'
    import { buildSupportedNamespacesFromSelections } from '@auxiliary/wallet-connect/actions'
    import { getNetworksAndMethodsFromNamespaces, updateSession } from '@auxiliary/wallet-connect/utils'
    import { IConnectedDapp, IDappMetadata, ISelections } from '@auxiliary/wallet-connect/interface'
    import { DappInfo } from '@ui'
    import { ALL_EVM_METHODS } from '@auxiliary/wallet-connect/constants'

    export let drawerRouter: Router<unknown>
    export let selections: ISelections
    export let titleLocale: string
    export let disableContinue: boolean

    const dappMetadata = getDappMetadata($selectedDapp, $sessionInitiationRequest)
    const { requiredMethods, optionalMethods } = getMethodsForNamespaces($selectedDapp, $sessionInitiationRequest)
    const { requiredNetworks, optionalNetworks } = getNetworksForNamespaces($selectedDapp, $sessionInitiationRequest)

    $: persistedDapp = dappMetadata ? getPersistedDapp(dappMetadata.url) : undefined

    function getDappMetadata(
        selectedDapp: IConnectedDapp | undefined,
        sessionInitiationRequest: SessionInitiationRequest | undefined
    ): IDappMetadata | undefined {
        if (selectedDapp) {
            return selectedDapp?.metadata
        } else if (sessionInitiationRequest?.type === 'session_proposal') {
            return sessionInitiationRequest?.payload.params.proposer.metadata as IDappMetadata
        } else if (sessionInitiationRequest?.type === 'session_authenticate') {
            return sessionInitiationRequest?.payload.params.requester.metadata as IDappMetadata
        } else {
            return undefined
        }
    }

    function getMethodsForNamespaces(
        selectedDapp: IConnectedDapp | undefined,
        sessionInitiationRequest: SessionInitiationRequest | undefined
    ): { requiredMethods: string[]; optionalMethods: string[] } {
        if (selectedDapp) {
            const { requiredNamespaces, optionalNamespaces } = selectedDapp ?? {}

            const { requiredMethods, optionalMethods } = getNetworksAndMethodsFromNamespaces(
                requiredNamespaces ?? {},
                optionalNamespaces ?? {}
            )
            return { requiredMethods, optionalMethods }
        } else if (sessionInitiationRequest?.type === 'session_proposal') {
            const { requiredNamespaces, optionalNamespaces } = sessionInitiationRequest.payload?.params ?? {}
            const { requiredMethods, optionalMethods } = getNetworksAndMethodsFromNamespaces(
                requiredNamespaces ?? {},
                optionalNamespaces ?? {}
            )
            return { requiredMethods, optionalMethods }
        } else if (sessionInitiationRequest?.type === 'session_authenticate') {
            return { requiredMethods: [], optionalMethods: ALL_EVM_METHODS }
        } else {
            return { requiredMethods: [], optionalMethods: [] }
        }
    }

    function getNetworksForNamespaces(
        selectedDapp: IConnectedDapp | undefined,
        sessionInitiationRequest: SessionInitiationRequest | undefined
    ): { requiredNetworks: string[]; optionalNetworks: string[] } {
        if (selectedDapp) {
            const { requiredNamespaces, optionalNamespaces } = selectedDapp ?? {}
            const { requiredNetworks, optionalNetworks } = getNetworksAndMethodsFromNamespaces(
                requiredNamespaces ?? {},
                optionalNamespaces ?? {}
            )
            return { requiredNetworks, optionalNetworks }
        } else if (sessionInitiationRequest?.type === 'session_proposal') {
            const { requiredNamespaces, optionalNamespaces } = sessionInitiationRequest.payload?.params ?? {}
            const { requiredNetworks, optionalNetworks } = getNetworksAndMethodsFromNamespaces(
                requiredNamespaces ?? {},
                optionalNamespaces ?? {}
            )
            return { requiredNetworks, optionalNetworks }
        } else if (sessionInitiationRequest?.type === 'session_authenticate') {
            // TODO: Implement this
            return { requiredNetworks: [], optionalNetworks: [] }
        } else {
            return { requiredNetworks: [], optionalNetworks: [] }
        }
    }

    function onConfirmClick(): void {
        // TODO: Implement this
        if ($sessionInitiationRequest?.type === 'session_authenticate') {
            return
        }

        const requiredNamespaces =
            $selectedDapp?.requiredNamespaces ?? $sessionInitiationRequest?.payload?.params.requiredNamespaces ?? {}
        const optionalNamespaces =
            $selectedDapp?.optionalNamespaces ?? $sessionInitiationRequest?.payload?.params.optionalNamespaces ?? {}

        const updatedNamespace = buildSupportedNamespacesFromSelections(
            selections,
            requiredNamespaces,
            optionalNamespaces,
            persistedDapp?.namespaces.supported
        )
        if (dappMetadata) {
            updateSupportedDappNamespacesForDapp(dappMetadata.url, updatedNamespace)
        }
        if ($selectedDapp?.sessionTopic) {
            updateSession($selectedDapp.sessionTopic, updatedNamespace)
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
                    {requiredMethods}
                    {optionalMethods}
                    {requiredNetworks}
                    {optionalNetworks}
                />
            </div>
        </div>
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button width="full" variant="outlined" on:click={onBackClick} text={localize('actions.back')} />
        <Button width="full" on:click={onConfirmClick} disabled={disableContinue} text={localize('actions.confirm')} />
    </div>
</DrawerTemplate>
