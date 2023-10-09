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
        <TextInput bind:value autofocus {error} {label} {...$$restProps}>
            <div slot="right">
                <IconButton icon={IconName.CrossClose} on:click={onCloseClick} />
            </div>
        </TextInput>
    {:else if inputType === 'number'}
        <NumberInput bind:value bind:error autofocus {label} {...$$restProps}>
            <div slot="right">
                <IconButton icon={IconName.CrossClose} on:click={onCloseClick} />
            </div>
        </NumberInput>
    {/if}
{/if}
