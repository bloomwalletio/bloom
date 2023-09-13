<script lang="ts">
    import { Platform } from '@core/app'
    import { OS } from '@core/app/constants'
    import { activeProfile } from '@core/profile/stores'
    import { AppRoute, appRoute } from '@core/router'
    import { onDestroy, onMount } from 'svelte'
    import { WindowsControlButtons, WindowsPopupMenu } from './'

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

<title-bar
    class:with-borders={isDashboardVisible}
    class="flex flex-row justify-between w-full h-7 transition-none bg-yellow-100"
>
    <!-- We need to add this element to allow fix the windows resize area issue due to -webkit-app-region: drag -->
    <windows-resize-area />
    <WindowsPopupMenu />
    <WindowsControlButtons />
</title-bar>

<style lang="scss">
    title-bar {
        -webkit-app-region: drag;

        > * {
            -webkit-app-region: none;
        }
    }

    title-bar.with-borders {
        @apply bg-gray-200 border-b border-gray-300 border-solid;
        @apply dark:bg-gray-950 dark:border-gray-950;
    }

    windows-resize-area {
        @apply absolute block h-1 left-20 top-0;
        width: calc(100% - 14rem);
    }
</style>
