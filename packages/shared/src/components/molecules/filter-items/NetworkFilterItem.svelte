<script lang="ts">
    import { getIscChains, getL1Network } from '@core/network'
    import { NetworkFilterUnit } from '@core/utils/interfaces/filter'
    import features from '@features/features'
    import { IOption, SelectInput } from '@bloomwalletio/ui'

    export let filterUnit: NetworkFilterUnit

    const options: IOption[] = getOptions()
    let selected: IOption | undefined = options.find((option) => option.value === filterUnit.selected) ?? options?.[0]

    function getOptions(): IOption[] {
        const l1Network = getL1Network()

        const iscpChains = features?.network?.layer2?.enabled ? getIscChains() : []

        return [l1Network, ...iscpChains].map((network) => ({
            label: network.name,
            value: network.id,
        }))
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
