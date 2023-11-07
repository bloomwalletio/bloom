<script lang="ts">
    import { DateInput, Icon, Text, IconName, IOption, NumberInput, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DateFilterUnit } from '@core/utils/interfaces/filter'
    import { DateFilterOption, DateUnit } from '@core/utils/enums/filters'

    export let filterUnit: DateFilterUnit

    const options: IOption[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))
    let selected = options.find((option) => option.value === filterUnit.selected)

    const unitChoices: IOption[] = Object.keys(DateUnit).map((val) => ({
        label: localize(`${filterUnit.localeKey}.${val}`),
        value: val,
    }))
    let selectedDateUnit = options.find((option) =>
        filterUnit.subunit.type === 'unit' ? option.value === filterUnit.subunit.unit : false
    )

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        if (filterUnit.selected === item.value) return

        filterUnit.selected = item.value as DateFilterOption
        switch (filterUnit.selected) {
            case DateFilterOption.Equals:
            case DateFilterOption.After:
            case DateFilterOption.AfterOrEquals:
            case DateFilterOption.Before:
                filterUnit.subunit = {
                    type: 'single',
                    value: undefined,
                }
                break
            case DateFilterOption.Range:
                filterUnit.subunit = {
                    type: 'range',
                    start: undefined,
                    end: undefined,
                }
                break
            case DateFilterOption.Last:
                filterUnit.subunit = {
                    type: 'unit',
                    amount: '0',
                    unit: DateUnit.Days,
                }
                break
        }
    }

    $: selectedDateUnit && onUnitSelect(selectedDateUnit)
    function onUnitSelect(item: IOption): void {
        if (filterUnit.subunit.type === 'unit') {
            filterUnit.subunit.unit = <DateUnit>item.value
        }
    }
</script>

<SelectInput bind:selected {options} hideValue />

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        {#if filterUnit.selected !== DateFilterOption.Range}
            <Icon name={IconName.ArrowNarrowRight} size="sm" textColor="secondary" />
        {/if}
        {#if filterUnit.subunit.type === 'range'}
            <!-- negative right margin prevents dates from wrapping to a second row unless length is MM.DD.YYYY -->
            <div class="flex items-center flex-wrap gap-2 -mr-1">
                <DateInput bind:value={filterUnit.subunit.start} />
                <Text textColor="secondary">{localize('general.and')}</Text>
                <DateInput bind:value={filterUnit.subunit.end} />
            </div>
        {:else if filterUnit.subunit.type === 'single'}
            <DateInput bind:value={filterUnit.subunit.value} />
        {:else if filterUnit.subunit.type === 'unit'}
            <NumberInput bind:value={filterUnit.subunit.amount} />
            <SelectInput bind:selected={selectedDateUnit} options={unitChoices} hideValue />
        {/if}
    </div>
{/if}
