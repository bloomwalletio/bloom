<script lang="ts">
    import { DrawerDirection, closeDrawer, drawerState } from '@desktop/auxiliary/drawer'
    import { CloseButton } from '@bloomwalletio/ui'
    import { fade, fly } from 'svelte/transition'

    export let onClose: () => unknown = () => {}

    const DRAWER_ANIMATION_DURATION_MS = 200

    let direction: { x: number; y: number }
    let position: string
    let isVertical: boolean

    $: $drawerState && setDirection($drawerState.direction)
    function setDirection(drawerDirection: DrawerDirection): void {
        switch (drawerDirection) {
            case DrawerDirection.Bottom:
                direction = { x: 0, y: 100 }
                position = 'bottom-0'
                isVertical = false
                break
            case DrawerDirection.Top:
                direction = { x: 0, y: -100 }
                position = 'top-0'
                isVertical = false
                break
            case DrawerDirection.Left:
                direction = { x: -100, y: 0 }
                position = 'left-0'
                isVertical = true
                break
            case DrawerDirection.Right:
                direction = { x: 100, y: 0 }
                position = 'right-0'
                isVertical = true
                break
        }
    }

    function onCloseClick(): void {
        if (!$drawerState?.preventClose) {
            onClose && onClose()
            closeDrawer()
        }
    }
</script>

{#if $drawerState?.active}
    <drawer class="absolute top-0 left-0 w-full h-full z-20">
        <overlay
            in:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            on:click={onCloseClick}
            on:keydown={() => {}}
            class="fixed left-0 w-full z-0 bg-neutral-6/75"
            style:height="calc(100% - var(--windows-navbar-height, 0px))"
        />
        <panel
            in:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            class="relative flex flex-col flex-auto overflow-hidden {position} {isVertical ? 'vertical' : 'horizontal'}"
            style:height="calc(100% - var(--windows-navbar-height, 0px))"
        >
            <div class="flex flex-col h-full">
                <slot name="contents" />
            </div>
            {#if !$drawerState.hideClose}
                <div class="absolute top-6 right-6">
                    <CloseButton size="sm" on:click={onCloseClick} />
                </div>
            {/if}
        </panel>
    </drawer>
{/if}

<style lang="scss">
    panel {
        @apply fixed;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply shadow;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        transition: right 0.2s ease;

        &.vertical {
            width: 420px;
        }

        &.horizontal {
            height: 350px;
            width: 100%;
        }
    }

    overlay {
        -webkit-app-region: none;
    }
</style>
