<script lang="ts">
    import { Progress } from '@bloomwalletio/ui'
    import { Animation } from '@ui'

    export let progress = 0
</script>

<div class={'flex flex-col justify-center align-center items-center w-full h-full'}>
    <Animation classes="h-64 w-64" animation="loading-desktop" loop={true} renderer="canvas" />
    <div class="flex-col justify-center items-center w-full max-w-lg">
        <Progress size="lg" labelInside {progress} />
    </div>
</div>
