<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { SelectionFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: SelectionFilterUnit

    const options: IOption[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)

    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }
</script>

<SelectInput {value} {options} {onSelect} small hideValue />
