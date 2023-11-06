<script lang="ts">
    import { SelectInput, Icon, Text, NumberInput, IOption, IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'
    import { NumberFilterUnit } from '@core/utils/interfaces/filter'
    import { NumberFilterOption } from '@core/utils/enums/filters'

    export let filterUnit: NumberFilterUnit

    const options: IOption[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    $: value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)

    function onSelect(item: IDropdownItem<NumberFilterOption>): void {
        filterUnit.selected = item.value

        switch (filterUnit.selected) {
            case NumberFilterOption.Equal:
            case NumberFilterOption.Greater:
            case NumberFilterOption.Less:
                filterUnit.subunit = {
                    type: 'single',
                    amount: undefined,
                }
                break
            case NumberFilterOption.Range:
                filterUnit.subunit = {
                    type: 'range',
                    start: undefined,
                    end: undefined,
                }
                break
        }
    }
</script>

<SelectInput {value} {options} {onSelect} small hideValue />

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        <Icon name={IconName.ArrowNarrowRight} size="sm" textColor="secondary" />
        {#if filterUnit.subunit.type === 'range'}
            <NumberInput bind:value={filterUnit.subunit.start} autofocus />
            <Text>{localize('general.and')}</Text>
            <NumberInput bind:value={filterUnit.subunit.end} />
        {:else}
            <NumberInput bind:value={filterUnit.subunit.amount} autofocus />
        {/if}
    </div>
{/if}
