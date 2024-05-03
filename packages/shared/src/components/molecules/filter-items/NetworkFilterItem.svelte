<script lang="ts">
    import { networks } from '@core/network'
    import { NetworkFilterUnit } from '@core/utils/interfaces/filter'
    import { IOption, SelectInput } from '@bloomwalletio/ui'

    export let filterUnit: NetworkFilterUnit

    const options: IOption[] = getOptions()
    let selected: IOption | undefined = options.find((option) => option.value === filterUnit.selected) ?? options?.[0]

    function getOptions(): IOption[] {
        return $networks.map((network) => ({
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
