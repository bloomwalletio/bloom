<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getAllNetworkIds } from '@core/network/utils'
    import { onMount } from 'svelte'

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

{#each networkSelections as network}
    <div class="w-full flex flex-row justify-between p-4">
        <Text>{network.label}</Text>
        {#if network.required}
            <Text textColor="success">Required</Text>
        {:else}
            <Checkbox bind:checked={network.checked} size="lg" />
        {/if}
    </div>
{/each}
