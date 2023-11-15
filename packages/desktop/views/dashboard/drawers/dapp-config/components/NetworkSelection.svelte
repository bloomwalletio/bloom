<script lang="ts">
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getAllNetworkIds } from '@core/network/utils'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'

    export let checkedNetworks: string[]

    let networkSelections: { label: string; value: string; checked: boolean; required: boolean }[] = []
    function setNetworkSelections(): void {
        const networks = {}
        for (const namespace of Object.values($sessionProposal.params.requiredNamespaces)) {
            for (const chain of namespace.chains) {
                networks[chain] = { label: chain, value: chain, checked: true, required: true }
            }
        }
        const supportedNetworks = getAllNetworkIds()
        for (const namespace of Object.values($sessionProposal.params.optionalNamespaces)) {
            for (const chain of namespace.chains) {
                if (!networks[chain] && supportedNetworks.includes(chain)) {
                    networks[chain] = { label: chain, value: chain, checked: true, required: false }
                }
            }
        }
        networkSelections = Object.values(networks)
    }

    $: checkedNetworks = networkSelections.filter((selection) => selection.checked).map((selection) => selection.value)

    onMount(() => {
        setNetworkSelections()
    })
</script>

<Selection
    bind:selectionOptions={networkSelections}
    title={localize('views.dashboard.drawers.dapps.confirmConnection.networks.title')}
/>
