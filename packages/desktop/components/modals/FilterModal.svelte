<script lang="ts">
    import { Modal } from '@ui'
    import { Text, Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Filter } from '@core/utils/types'

    export let modal: Modal = undefined
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
        modal.close()
    }

    function onConfirmClick(): void {
        setFilters()
        modal.toggle()
    }
</script>

<Modal
    bind:this={modal}
    on:close={closeFilters}
    position={{ absolute: true, right: '0', top: '30px' }}
    classes="overflow-visible"
    autoMaxHeight
>
    <filter-modal>
        <filter-modal-header
            class="flex flex-row items-center justify-between bg-gray-50 dark:bg-transparent px-4 py-2 rounded-t-xl"
        >
            <Button text={localize('actions.clear')} on:click={onClearClick} size="xs" variant="outlined" />
            <Text align="center">
                {localize('filters.title')}
            </Text>
            <Button text={localize('actions.apply')} on:click={onConfirmClick} size="xs" disabled={!isChanged} />
        </filter-modal-header>
        <filter-modal-slot class="block">
            <slot />
        </filter-modal-slot>
    </filter-modal>
</Modal>

<style lang="scss">
    filter-modal {
        @apply block w-64;
        border-radius: inherit;
    }
</style>
