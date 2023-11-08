<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { SelectionFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: SelectionFilterUnit

    const options: IOption[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))
    let selected = options.find((option) => option.value === filterUnit.selected)

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }
</script>

<SelectInput bind:selected {options} hideValue />
