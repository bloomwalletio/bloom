<script lang="ts">
    import { NumberInput, TextInput, IconName, IconButton } from '@bloomwalletio/ui'

    export let value = ''
    export let open = false
    export let label: string
    export let error: string = ''
    export let inputType: 'text' | 'number' = 'text'

    function onCloseClick(): void {
        open = false
        value = ''
    }
</script>

{#if open}
    {#if inputType === 'text'}
        <TextInput bind:value autofocus bind:error {label} {...$$restProps}>
            <IconButton icon={IconName.CrossClose} on:click={onCloseClick} size="xs" />
        </TextInput>
    {:else if inputType === 'number'}
        <NumberInput bind:value bind:error autofocus {label} {...$$restProps}>
            <IconButton icon={IconName.CrossClose} on:click={onCloseClick} size="xs" />
        </NumberInput>
    {/if}
{/if}
