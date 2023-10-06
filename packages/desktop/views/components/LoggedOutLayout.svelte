<script lang="ts">
    import { NavbarContainer } from '@components'
    import { IS_MAC } from '@core/app'
    import { IS_LINUX } from 'shared/src/lib/core/app'
</script>

{#if IS_MAC}
    <NavbarContainer ghost draggable>
        <div style:height="var(--navbar-height)" style:--macos-navbar-height="var(--navbar-height)" />
    </NavbarContainer>
{/if}
<logged-out-layout class="flex flex-col justify-between items-center w-full h-full bg-slate-100 dark:bg-gray-900">
    <header class="w-full flex flex-col px-12 pt-{IS_LINUX ? '8' : '4'} pb-6">
        <slot name="header" />
    </header>
    <slot name="content" />
    <footer class="flex flex-col w-full relative bottom-0">
        <slot name="footer" />
    </footer>
</logged-out-layout>

<style lang="postcss">
    logged-out-layout {
        max-height: calc(100vh - var(--macos-navbar-height, 0px));
    }
</style>
