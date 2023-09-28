<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let disabled = false
    export let text = ''

    $: disabled = disabled
</script>

<button
    on:click|stopPropagation
    type="button"
    class="flex flex-row justify-center items-center space-x-2 px-1.5 rounded-md"
    {disabled}
>
    <slot name="button" />
    {#if !$$slots.button}
        <Text size="sm" weight="semibold" color="#1E1B4E">
            {text}
        </Text>
    {/if}
</button>

<style lang="scss">
    button {
        &:hover:not(:disabled) {
            @apply bg-purple-100;
        }
    }
</style>
