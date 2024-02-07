<script lang="ts">
    import { Checkbox, Error, Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let selectionOptions: {
        label: string
        value: unknown
        checked: boolean
        required: boolean
    }[]
    export let showPrimary: boolean = false
    export let title: string
    export let error: string | undefined = undefined

    $: indexOfPrimary = selectionOptions.findIndex((option) => option.checked)

    let allChecked = true
    function onAllClick() {
        if (allChecked) {
            selectionOptions = selectionOptions.map((option) => ({ ...option, checked: true }))
        } else {
            selectionOptions = selectionOptions.map((option) => ({ ...option, checked: false || option.required }))
        }
    }

    $: {
        allChecked = selectionOptions.every((option) => option.checked)
    }
</script>

<selection-component class="flex flex-col gap-4">
    <div class="flex flex-row justify-between items-center px-4">
        <Text textColor="secondary">{title}</Text>
        <div class="flex flex-row items-center gap-3">
            <Text textColor="secondary">{localize('general.all')}</Text>
            <Checkbox size="md" on:click={onAllClick} bind:checked={allChecked} />
        </div>
    </div>
    <selection-options>
        {#each selectionOptions as option, index}
            <div class="w-full flex flex-row items-center justify-between p-4">
                <div class="flex items-center gap-2">
                    <Text>{option.label}</Text>
                    {#if showPrimary && indexOfPrimary === index}
                        <Pill color="info">{localize('general.primary')}</Pill>
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
