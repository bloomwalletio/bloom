<script lang="ts">
    import { Checkbox, Error, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let selectionOptions: { label: string; value: unknown; checked: boolean; required: boolean }[]
    export let title: string
    export let error: string | undefined = undefined
</script>

<selection-component class="flex flex-col gap-4">
    <Text textColor="secondary">{title}</Text>

    <selection-options>
        {#each selectionOptions as option}
            <div class="w-full flex flex-row justify-between p-4">
                <Text>{option.label}</Text>
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
