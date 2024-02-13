<script lang="ts">
    import { clickOutside } from '@core/utils'
    import { Box } from '@ui'
    import { Error } from '@bloomwalletio/ui'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let isFocused: boolean = false
    export let error: string = ''
    export let classes: string = ''
    export let backgroundColor: string | undefined = undefined
    export let darkBackgroundColor: string | undefined = undefined
    export let clearBackground = false
    export let clearPadding = false
    export let clearBorder = false

    const tabindex = Object.keys($$slots) ? -1 : 0 // if the slot is not empty then makes the button not tabbable

    function onClickOutside(): void {
        isFocused = false
    }
</script>

<div class="w-full flex flex-col space-y-1" use:clickOutside on:clickOutside={onClickOutside}>
    <button
        class="cursor-text w-full flex flex-row"
        type="button"
        on:click={() => {
            inputElement && inputElement.focus()
        }}
        {tabindex}
    >
        <Box
            on:click
            {clearBackground}
            {clearPadding}
            {backgroundColor}
            {darkBackgroundColor}
            classes="w-full flex
                {!clearPadding ? 'p-4' : ''}
                {!clearBorder ? 'border border-solid rounded-xl' : ''}
                {classes}
                {isFocused
                ? 'border-brand'
                : error
                  ? 'border-red-300 hover:border-red-500'
                  : 'border-stroke dark:border-stroke-dark'}"
            {...$$restProps}
        >
            <slot />
        </Box>
    </button>
    {#if error}
        <Error {error} />
    {/if}
</div>
