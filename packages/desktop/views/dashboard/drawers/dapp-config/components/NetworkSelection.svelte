<script lang="ts">
    import { getAllNetworkIds } from '@core/network/utils'
    import { onMount } from 'svelte'
    import { Selection } from '@ui'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { NetworkId, getEvmNetwork } from '@core/network'
    import { SelectionOption } from '@core/utils/interfaces'

    export let checkedNetworks: string[]
    export let requiredNetworks: string[]
    export let optionalNetworks: string[]
    export let supportedNamespaces: SupportedNamespaces | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.networks'

    let requiredNetworksOptions: SelectionOption<NetworkId>[] = []
    let optionalNetworksOptions: SelectionOption<NetworkId>[] = []
    function setNetworkSelections(): void {
        const networks: Record<string, SelectionOption<NetworkId>> = {}
        for (const chainId of requiredNetworks) {
            const chainName = getEvmNetwork(chainId as NetworkId)?.name ?? chainId
            networks[chainId] = { label: chainName, value: chainId as NetworkId, checked: true, required: true }
        }
        const supportedNetworks = getAllNetworkIds()

        const persistedChains = Object.values(supportedNamespaces ?? {}).flatMap(({ chains }) => chains)
        for (const chainId of optionalNetworks) {
            if (!networks[chainId] && supportedNetworks.includes(chainId)) {
                const isChecked = persistedChains?.includes(chainId) ?? true
                const chainName = getEvmNetwork(chainId as NetworkId)?.name ?? chainId
                networks[chainId] = {
                    label: chainName,
                    value: chainId as NetworkId,
                    checked: isChecked,
                    required: false,
                }
            }
        }

        requiredNetworksOptions = Object.values(networks).filter((network) => network.required)
        optionalNetworksOptions = Object.values(networks).filter((network) => !network.required)
    }

    $: checkedNetworks = [...requiredNetworksOptions, ...optionalNetworksOptions]
        .filter((selection) => selection.checked)
        .map((selection) => selection.value)

    onMount(() => {
        setNetworkSelections()
    })
</script>

<div class="h-full flex flex-col gap-8">
    {#if requiredNetworksOptions.length}
        <Selection
            bind:selectionOptions={requiredNetworksOptions}
            disableSelectAll
            title={localize(`${localeKey}.requiredTitle`)}
        />
    {/if}
    {#if optionalNetworksOptions.length}
        <Selection
            bind:selectionOptions={optionalNetworksOptions}
            title={localize(`${localeKey}.optionalTitle`)}
            error={checkedNetworks.length ? undefined : localize(`${localeKey}.empty`)}
        />
    {/if}
</div>
