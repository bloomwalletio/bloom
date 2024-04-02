<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { OrderFilterUnit } from '@core/utils/interfaces/filter'
    import { OrderOption } from '@core/utils/enums/filters'

    export let filterUnit: OrderFilterUnit

    const options: IOption[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))
    let selected = options.find((option) => option.value === filterUnit.selected)

    const ascDescOptions: IOption[] = [OrderOption.Asc, OrderOption.Desc].map((choice) => ({
        label: localize(`filters.ascDesc.${choice}`),
        value: choice,
    }))
    let selectedAscDesc = ascDescOptions.find((option) => option.value === filterUnit.ascDesc)

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }

    $: selectedAscDesc && onSelectAscDesc(selectedAscDesc)
    function onSelectAscDesc(item: IOption): void {
        filterUnit.ascDesc = item.value as OrderOption
    }
</script>

<div class="flex flex-row justify-between space-x-2">
    <SelectInput bind:selected {options} hideValue />
    <SelectInput bind:selected={selectedAscDesc} options={ascDescOptions} hideValue />
</div>
