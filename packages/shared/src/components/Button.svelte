<script lang="ts">
    import { ButtonSize, ButtonVariant, HTMLButtonType, Icon, Spinner } from '@ui'
    import { onMount } from 'svelte'
    import { debounce } from '@core/utils'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let autofocus: boolean = false
    export let classes: string = ''
    export let disabled: boolean = false
    export let hidden: boolean = false
    export let inlineStyle: string = ''
    export let type: HTMLButtonType = HTMLButtonType.Button

    export let variant: ButtonVariant = ButtonVariant.Primary
    export let size: ButtonSize = ButtonSize.Large
    export let outline: boolean = false

    export let icon: IconEnum = null
    export let iconHeight: number = null
    export let iconWidth: number = null
    export let iconColor: string = null
    export let iconReverse: boolean = false

    export let isBusy: boolean = false
    export let busyMessage: string = ''

    export let form: string = null
    export let buttonElement: HTMLButtonElement = undefined

    export let onClick: () => unknown = () => {}

    export function resetAndFocus(): void {
        if (disabled) {
            setTimeout(resetAndFocus, 100)
        } else {
            buttonElement?.focus()
        }
    }

    const ICON_DEFAULT_SIZE: Readonly<{ [key in ButtonSize]: number }> = {
        [ButtonSize.Large]: 20,
        [ButtonSize.Medium]: 16,
        [ButtonSize.Small]: 12,
    }

    onMount(() => {
        if (autofocus) {
            buttonElement?.focus()
        }
    })
</script>

<button
    {disabled}
    {hidden}
    {type}
    {form}
    style={inlineStyle}
    class={`${size} ${variant} ${classes}`}
    class:outlined={outline}
    class:is-busy={isBusy}
    on:click|stopPropagation={debounce(onClick, 100)}
    bind:this={buttonElement}
>
    {#if isBusy}
        <div class="relative flex justify-center items-center h-4 w-4 shrink-0" class:mr-3={busyMessage}>
            <Spinner busy classes="absolute items-center justify-center" />
        </div>
        {busyMessage}
    {:else}
        <div class="flex flex-row items-center justify-center w-full" class:flex-row-reverse={iconReverse}>
            {#if icon}
                <Icon
                    {icon}
                    classes="text-{iconColor} mx-2"
                    height={iconHeight ?? ICON_DEFAULT_SIZE[size]}
                    width={iconWidth ?? ICON_DEFAULT_SIZE[size]}
                />
            {/if}
            <slot />
        </div>
    {/if}
</button>

<style lang="scss">
    button {
        @apply flex flex-row items-center justify-center;
        @apply text-center font-500 text-15 leading-4;
        @apply box-border cursor-pointer rounded-lg;

        &.is-busy {
            @apply text-left;
        }
    }

    button:disabled {
        @apply bg-gray-200 text-gray-500;
        @apply dark:bg-gray-700 dark:bg-opacity-10 dark:text-gray-700;
        @apply pointer-events-none;

        :global(spinner-container svg) {
            @apply text-gray-500;
        }
    }

    .lg {
        @apply px-8 py-4;

        &.outlined {
            padding-top: calc(1rem - 1px);
            padding-bottom: calc(1rem - 1px);
        }
    }

    .md {
        @apply px-8 py-3;

        &.outlined {
            padding-top: calc(0.75rem - 1px);
            padding-bottom: calc(0.75rem - 1px);
        }
    }

    .sm {
        @apply px-3 py-2 text-13;

        &.outlined {
            padding-top: calc(0.5rem - 1px);
            padding-bottom: calc(0.5rem - 1px);
        }
    }

    @mixin button-variant($color) {
        @apply bg-#{$color}-500 text-white;

        :global(spinner-container svg) {
            @apply text-white;
        }

        &:hover {
            @apply bg-#{$color}-600;
        }

        &:active,
        &:focus {
            @apply bg-#{$color}-700;
            @apply ring-4 ring-#{$color}-400 ring-opacity-20;
        }

        &.outlined {
            @apply bg-white;
            @apply text-#{$color}-500;
            @apply border border-solid border-gray-300;
            @apply dark:bg-gray-700 dark:bg-opacity-20;
            @apply dark:border-gray-600 dark:border-opacity-40;
            @apply dark:text-gray-400;

            &:hover {
                @apply bg-#{$color}-50 border-#{$color}-200;
                @apply dark:bg-#{$color}-800 dark:bg-opacity-20 dark:border-opacity-60 dark:text-white;
            }

            &:active,
            &:focus {
                @apply bg-#{$color}-100 border-#{$color}-400 text-#{$color}-600;
                @apply dark:bg-opacity-40 dark:border-opacity-100 dark:text-white;
            }

            &:disabled {
                @apply text-gray-500 bg-gray-50 bg-opacity-50 border-opacity-50;
                @apply dark:bg-transparent dark:border-gray-700 dark:text-opacity-50;
            }

            :global(spinner-container svg) {
                @apply text-gray-500;
            }
        }
    }

    .primary {
        @include button-variant('blue');
    }

    .caution {
        @include button-variant('yellow');
    }

    .warning {
        @include button-variant('red');
    }
</style>
