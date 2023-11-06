<script lang="ts">
    import { ChainType, network } from '@core/network'
    import { NetworkFilterUnit } from '@core/utils/interfaces/filter'
    import features from '@features/features'
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'

    export let filterUnit: NetworkFilterUnit

    let options: IOption[] = []
    let selected: IOption | undefined = undefined

    onMount(buildOptions)

    function buildOptions(): void {
        if (!$network) {
            return
        }
        // L1 network, we consider layer 1 as "chain 0"
        const layer1Network = {
            label: $network.getMetadata().name,
            value: $network.getMetadata().id,
        }
        // L2 chains, ISCP only for now
        const iscpChains = features?.network?.layer2?.enabled
            ? $network.getChains().filter((chain) => chain.getConfiguration().type === ChainType.Iscp)
            : []
        const iscpChainsOptions = iscpChains.map((chain) => ({
            label: chain.getConfiguration().name,
            value: chain.getConfiguration().id,
        }))
        options = [layer1Network, ...iscpChainsOptions]
        selected = options.find((option) => option.value === filterUnit.selected)
    }

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }
</script>

<SelectInput bind:selected {options} hideValue />
