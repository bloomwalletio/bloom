<script lang="ts">
    import { Checkbox, Error, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { SelectionOption } from '@core/utils'

    type T = $$Generic

    export let selectionOptions: SelectionOption<T>[]
    export let title: string
    export let disableSelectAll: boolean = false
    export let error: string | undefined = undefined

    let allChecked = true
    function onAllClick(): void {
        if (allChecked) {
            selectionOptions = selectionOptions.map((option) => ({ ...option, checked: true }))
        } else {
            selectionOptions = selectionOptions.map((option) => ({ ...option, checked: option.required }))
        }
    }

    $: allChecked = selectionOptions.every((option) => option.checked)
</script>

<selection-component class="flex flex-col gap-4">
    <div class="flex flex-row justify-between items-center px-4">
        <Text textColor="secondary">{title}</Text>
        {#if !disableSelectAll}
            <div class="flex flex-row items-center gap-3">
                <Text textColor="secondary">{localize('general.all')}</Text>
                <Checkbox size="md" on:click={onAllClick} bind:checked={allChecked} />
            </div>
        {/if}
    </div>
    <selection-options>
        {#each selectionOptions as option, index}
            <div class="w-full flex flex-row items-center justify-between p-4 gap-3">
                <div class="flex-grow flex items-center gap-2">
                    {#if $$slots.default}
                        <slot {option} {index} />
                    {:else}
                        <Text>{option.label}</Text>
                    {/if}
                </div>
                {#if option.required}
                    <Text textColor="success">{localize('general.required')}</Text>
                {:else}
                    <Checkbox bind:checked={option.checked} size="md" />
                {/if}
            </div>
        {/each}
    </selection-options>
    {#if error}
        <Error {error} />
    {/if}
</selection-component>

<style lang="postcss">
    selection-options {
        @apply bg-surface-0 dark:bg-surface-0-dark;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply rounded-xl;
    }
</style>
