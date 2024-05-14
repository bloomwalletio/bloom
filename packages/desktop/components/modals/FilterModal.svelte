<script lang="ts">
    import { Modal } from '@ui'
    import { Text, Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Filter } from '@core/utils/types'

    export let modal: Modal | undefined = undefined
    export let filter: Filter
    export let isChanged: boolean
    export let setFilters: () => void
    export let closeFilters: () => void

    function onClearClick(): void {
        for (const key in filter) {
            filter[key].active = false
            filter[key].value = undefined
        }
        setFilters()
        modal?.close()
    }

    function onConfirmClick(): void {
        setFilters()
        modal?.toggle()
    }
</script>

<Modal
    bind:this={modal}
    on:close={closeFilters}
    position={{ absolute: true, right: '0', top: '30px' }}
    classes="flex !overflow-hidden"
    autoMaxHeight
>
    <filter-modal class="flex flex-col w-64 rounded-[inherit]">
        <filter-modal-header
            class="flex-none flex flex-row items-center justify-between bg-surface-1 dark:bg-transparent px-4 py-2 rounded-t-xl"
        >
            <Button text={localize('actions.clear')} on:click={onClearClick} size="xs" variant="outlined" />
            <Text align="center">
                {localize('filters.title')}
            </Text>
            <Button text={localize('actions.apply')} on:click={onConfirmClick} size="xs" disabled={!isChanged} />
        </filter-modal-header>
        <filter-modal-slot class="flex-1 h-0 overflow-y-scroll">
            <slot />
        </filter-modal-slot>
    </filter-modal>
</Modal>
