<script lang="ts">
    import { clickOutside } from '@core/utils'
    import { fade } from 'svelte/transition'
    import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'

    export let position: { top?: string; right?: string; bottom?: string; left?: string; absolute?: boolean } = {}
    export let size: 'small' | 'medium' | 'large' = 'medium'
    export let classes: string = ''
    export let disableOnClickOutside = false
    export let fixed = false
    export let autoMaxHeight = false

    export function close(): void {
        setShow(false)
    }

    export function open(): void {
        setShow(true)
    }

    export function toggle(): void {
        show ? close() : open()
    }

    export function isOpened(): boolean {
        return show
    }

    const { top = 'inherit', right = 'inherit', bottom = 'inherit', left = 'inherit', absolute = 'true' } = position
    const dispatch = createEventDispatcher()

    let isBlockedByTimeout = false
    let show = false
    let modal: HTMLElement
    let maxHeight: number

    function setShow(bool: boolean): void {
        if (!isBlockedByTimeout) {
            show = bool
            isBlockedByTimeout = true
            setTimeout(() => (isBlockedByTimeout = false), 100)
            show ? dispatch('open') : dispatch('close')
        }
    }

    function onClickOutside(): void {
        if (disableOnClickOutside) {
            return
        }

        close()
    }

    async function updateMaxHeight(): Promise<void> {
        await tick()
        if (!show || !modal) {
            return
        }

        const viewportHeight = window.innerHeight
        const modalRect = modal.getBoundingClientRect()

        const availableSpace = position.top ? viewportHeight - modalRect.top : modalRect.bottom
        maxHeight = availableSpace - 10
    }

    function handleResize(): void {
        void updateMaxHeight()
    }

    onMount(() => {
        if (autoMaxHeight) {
            window.addEventListener('resize', handleResize)
            void updateMaxHeight()
        }
    })

    onDestroy(() => {
        if (autoMaxHeight) {
            window.removeEventListener('resize', handleResize)
        }
    })

    $: if (show && autoMaxHeight) {
        void updateMaxHeight()
    }
</script>

{#if show}
    <modal-content
        bind:this={modal}
        in:fade|global={{ duration: 100 }}
        use:clickOutside
        on:clickOutside={onClickOutside}
        class="{size} {classes}"
        style:max-height={maxHeight ? `${maxHeight}px` : undefined}
        style:top
        style:right
        style:bottom
        style:left
        style:position={fixed ? 'fixed' : absolute ? 'absolute' : 'relative'}
    >
        <slot />
    </modal-content>
{/if}

<style lang="postcss">
    modal-content {
        @apply bg-surface-0 dark:bg-surface-0-dark shadow-elevation-4;
        @apply rounded-xl border border-solid border-stroke dark:border-stroke-dark;
        @apply overflow-y-scroll overflow-x-hidden z-10;
    }

    .medium {
        min-width: 230px;
    }

    .large {
        min-width: 420px;
    }
</style>
