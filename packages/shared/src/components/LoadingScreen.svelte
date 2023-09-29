<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { Progress } from '@bloomwalletio/ui'
    import { Logo } from '@ui'

    export let progress = 0
</script>

<div class={'flex flex-col justify-center w-full h-full'}>
    <!-- <Animation classes="h-64 w-64" animation="loading-desktop" loop={true} renderer="canvas" /> -->
    <div class="column flex flex-col items-center w-full">
        <Logo width="100" logo={LogoName.BloomLogo} />
        <div class="flex-col justify-center items-center w-full max-w-lg">
            <Progress size="lg" showLabel {progress} />
        </div>
    </div>
</div>

<style lang="postcss">
    .column {
        @apply space-y-16;
    }
</style>
