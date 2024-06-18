<script lang="ts">
    import { OS } from '@core/app/constants'
    import { activeProfile } from '@core/profile/stores'
    import { AppRoute, appRoute } from '@core/router'
    import { onMount } from 'svelte'
    import { NavbarContainer, WindowsControlButtons, WindowsPopupMenu } from './'

    const { hasLoadedAccounts } = $activeProfile

    $: isDashboardVisible = $appRoute === AppRoute.Dashboard && $hasLoadedAccounts

    onMount(() => {
        document.body.classList.add(`platform-${OS}`)
    })
</script>

<NavbarContainer draggable ghost={!isDashboardVisible}>
    <div class="flex flex-row justify-between w-full" style:height="var(--windows-navbar-height, 0px)">
        <!-- We need to add this element to allow fix the windows resize area issue due to -webkit-app-region: drag -->
        <windows-resize-area class="absolute block h-1 left-20 top-0" />
        <WindowsPopupMenu />
        <WindowsControlButtons />
    </div>
</NavbarContainer>

<style lang="postcss">
    :global(.platform-win32) {
        --windows-navbar-height: 28px;
    }

    windows-resize-area {
        width: calc(100% - 14rem);
    }
</style>
