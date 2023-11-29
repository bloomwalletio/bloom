<script lang="ts">
    import appFeatures from '@features/app.features'
    import { BgGradient, Particles } from '.'

    export let surface: 0 | 1 | 2 | 'brand' | 'invert' = 0
    export let gradient: 'spread' | 'center' | undefined = undefined
    export let particles: boolean = false
</script>

<div class="absolute inset-0 flex items-center justify-center bg-surface-{surface} dark:bg-surface-{surface}-dark">
    {#if gradient}
        <BgGradient variant={gradient} />
    {/if}
    {#if particles && appFeatures?.particles?.enabled}
        <Particles />
    {/if}
</div>
