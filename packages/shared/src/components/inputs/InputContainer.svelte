<script lang="ts">
    import { clickOutside } from '@core/utils'
    import { Error } from '@bloomwalletio/ui'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let isFocused: boolean = false
    export let error: string = ''
    export let classes: string = ''

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
        <div
            class="w-full flex rounded-lg
            {classes}
            {isFocused
                ? 'border-brand'
                : error
                  ? 'border-red-300 hover:border-red-500'
                  : 'border-stroke dark:border-stroke-dark'}"
        >
            <slot />
        </div>
    </button>
    {#if error}
        <Error {error} />
    {/if}
</div>
