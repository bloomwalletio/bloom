<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { NavbarContainer } from '@components'
    import { IS_MAC } from '@core/app'
    import { Logo } from '@ui'
    import { Background } from '.'
    import { style } from '@core/utils/ui'

    export let glass: boolean = false
    export let hideLogo: boolean = false
    export let gradient: 'spread' | 'center' | undefined = undefined
    export let particles: boolean = false

    const MACOS_NAVBAR_HEIGHT = IS_MAC ? '40px' : '0px'
</script>

<Background {gradient} {particles} />
{#if IS_MAC}
    <NavbarContainer draggable>
        <div use:style={{ height: MACOS_NAVBAR_HEIGHT }} />
    </NavbarContainer>
{/if}
<logged-out-layout
    class="flex flex-col items-center w-full h-full z-10"
    use:style={{ maxHeight: `calc(100vh - ${MACOS_NAVBAR_HEIGHT})` }}
>
    {#if !hideLogo}
        <header class="w-full flex flex-row items-center justify-between px-6" class:glass>
            <logo class="flex flex-row flex-none space-x-3">
                <Logo width="32" logo={LogoName.BloomLogo} />
                <Logo width="80" logo={LogoName.BloomText} />
            </logo>
            <slot name="button" />
        </header>
    {/if}
    <slot name="content" />
    <slot />
</logged-out-layout>

<style lang="scss">
    header {
        @apply fixed z-10;
        height: 67px;

        &.glass {
            @apply bg-surface/90 dark:bg-surface-dark/60 z-20;
            backdrop-filter: blur(16px);
        }
    }
</style>
