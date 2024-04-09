<script lang="ts">
    import { ChainType, network } from '@core/network'
    import { NetworkFilterUnit } from '@core/utils/interfaces/filter'
    import features from '@features/features'
    import { IOption, SelectInput } from '@bloomwalletio/ui'

    export let filterUnit: NetworkFilterUnit

    const options: IOption[] = getOptions()
    let selected: IOption | undefined = options.find((option) => option.value === filterUnit.selected) ?? options?.[0]

    function getOptions(): IOption[] {
        if (!$network) {
            return []
        }
        // L1 network
        const layer1Network = {
            label: $network.getMetadata().name,
            value: $network.getMetadata().id,
        }
        // L2 chains, ISCP only for now
        const iscpChains = features?.network?.layer2?.enabled
            ? $network.getChains().filter((chain) => chain.type === ChainType.Iscp)
            : []
        const iscpChainsOptions = iscpChains.map((chain) => ({
            label: chain.name,
            value: chain.id,
        }))
        return [layer1Network, ...iscpChainsOptions]
    }

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        if (!item) {
            return
        }
        filterUnit.selected = item.value
    }
</script>

{#if options}
    <SelectInput bind:selected {options} hideValue />
{/if}
