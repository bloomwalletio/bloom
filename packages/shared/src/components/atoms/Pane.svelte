<script lang="ts">
    import { darkMode } from '@core/app/stores'

    export let classes = ''
    export let overflow = 'hidden'
    export let surface: '0' | '1' | '2' = '0'

    const BACKGROUND_COLOR = {
        0: 'bg-surface dark:bg-surface-dark',
        1: 'bg-surface-1 dark:bg-surface-1-dark',
        2: 'bg-surface-2 dark:bg-surface-2-dark',
    }
</script>

<div
    class:darkmode={$darkMode}
    class="{BACKGROUND_COLOR[
        surface
    ]} border border-solid border-stroke dark:border-stroke-dark rounded-2xl overflow-{overflow} {classes}"
>
    <slot />
</div>
