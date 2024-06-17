<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import {
        DateFilterItem,
        NumberFilterItem,
        SelectionFilterItem,
        TokenFilterItem,
        OrderFilterItem,
        NetworkFilterItem,
    } from '@ui'
    import { Checkbox, IconButton, IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { FilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: FilterUnit
    export let isOpen: boolean

    const dispatch = createEventDispatcher()

    function onArrowClick(): void {
        dispatch('toggle')
    }

    function onCheckBoxClick(): void {
        dispatch(filterUnit.active ? 'open' : 'close')
    }
</script>

<filter-item class="block border-t border-solid border-gray-200 dark:border-gray-800">
    <filter-item-toggle class="flex flex-row justify-between px-4 py-2">
        <Checkbox
            label={localize(filterUnit.labelKey ?? filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            size="md"
            on:click={onCheckBoxClick}
        />

        <IconButton icon={isOpen ? IconName.ChevronUp : IconName.ChevronDown} size="sm" on:click={onArrowClick} />
    </filter-item-toggle>
    {#if isOpen}
        <filter-item-type class="block expanded px-4 py-3 bg-gray-50 dark:bg-transparent">
            {#if filterUnit.type === 'number'}
                <NumberFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'date'}
                <DateFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'selection'}
                <SelectionFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'order'}
                <OrderFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'token'}
                <TokenFilterItem bind:filterUnit />
            {:else if filterUnit.type === 'network'}
                <NetworkFilterItem bind:filterUnit />
            {/if}
        </filter-item-type>
    {/if}
</filter-item>

<style lang="postcss">
    filter-item:last-child .expanded {
        @apply rounded-b-xl;
    }
</style>
