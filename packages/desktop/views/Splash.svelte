<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { Logo } from '@ui'
</script>

<div
    class="w-full h-full flex flex-col justify-center items-center animate-pulse -mt-0.5 pr-100 bg-surface dark:bg-surface-dark"
>
    <Logo width="300" logo={LogoName.BloomLogoFull} />
</div>

<style type="postcss">
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
    }
</style>
