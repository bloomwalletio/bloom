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

    const ascDescOptions: IOption[] = [OrderOption.Asc, OrderOption.Desc].map((choice) => ({
        label: localize(`filters.ascDesc.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)
    $: ascDescvalue = localize(`filters.ascDesc.${filterUnit.ascDesc}`)

    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }

    function onSelectAscDesc(item: IOption): void {
        filterUnit.ascDesc = item.value
    }
</script>

<div class="flex flex-row justify-between space-x-2">
    <SelectInput {value} {options} {onSelect} small hideValue />
    <SelectInput value={ascDescvalue} options={ascDescOptions} onSelect={onSelectAscDesc} small hideValue />
</div>
