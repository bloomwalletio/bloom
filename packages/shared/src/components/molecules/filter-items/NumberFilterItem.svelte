<script lang="ts">
    import { SelectInput, Icon, Text, NumberInput, IOption, IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NumberFilterUnit } from '@core/utils/interfaces/filter'
    import { NumberFilterOption } from '@core/utils/enums/filters'

    export let filterUnit: NumberFilterUnit

    const options: IOption[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))
    let selected = options.find((option) => option.value === filterUnit.selected)

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        if (filterUnit.selected === item.value) {
            return
        }

        filterUnit.selected = item.value as NumberFilterOption
        switch (filterUnit.selected) {
            case NumberFilterOption.Equal:
            case NumberFilterOption.Greater:
            case NumberFilterOption.Less:
                filterUnit.subunit = {
                    type: 'single',
                    amount: 0,
                }
                break
            case NumberFilterOption.Range:
                filterUnit.subunit = {
                    type: 'range',
                    start: 0,
                    end: 0,
                }
                break
        }
    }
</script>

<SelectInput bind:selected {options} hideValue />

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        <Icon name={IconName.ArrowNarrowRight} size="sm" textColor="secondary" />
        {#if filterUnit.subunit.type === 'range'}
            <NumberInput bind:value={filterUnit.subunit.start} autofocus />
            <Text textColor="secondary">{localize('general.and')}</Text>
            <NumberInput bind:value={filterUnit.subunit.end} />
        {:else}
            <NumberInput bind:value={filterUnit.subunit.amount} autofocus />
        {/if}
    </div>
{/if}
