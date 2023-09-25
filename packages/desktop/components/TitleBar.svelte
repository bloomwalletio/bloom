<script lang="ts">
    import { Platform } from '@core/app'
    import { OS } from '@core/app/constants'
    import { activeProfile } from '@core/profile/stores'
    import { AppRoute, appRoute } from '@core/router'
    import { onDestroy, onMount } from 'svelte'
    import { NavbarContainer, WindowsControlButtons, WindowsPopupMenu } from './'

    const { hasLoadedAccounts } = $activeProfile

    let isMaximized = false

    $: isDashboardVisible = $appRoute === AppRoute.Dashboard && $hasLoadedAccounts

    async function onResize(): Promise<void> {
        isMaximized = await Platform.isMaximized()
    }

    onMount(async () => {
        await onResize()
        document.body.classList.add(`platform-${OS}`)
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.addEventListener('resize', onResize)
    })

    onDestroy(() => {
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.removeEventListener('resize', onResize)
    })
</script>

<NavbarContainer draggable ghost={!isDashboardVisible}>
    <div class="flex flex-row justify-between w-full" style:height="var(--windows-navbar-height)">
        <!-- We need to add this element to allow fix the windows resize area issue due to -webkit-app-region: drag -->
        <windows-resize-area />
        <WindowsPopupMenu />
        <WindowsControlButtons />
    </div>
</NavbarContainer>

<style lang="scss">
    :global(:root) {
        --windows-navbar-height: 28px;
    }

    windows-resize-area {
        @apply absolute block h-1 left-20 top-0;
        width: calc(100% - 14rem);
    }
</style>
