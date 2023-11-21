<script lang="ts">
    import { darkMode } from '@core/app/stores'

    export let classes = ''
    export let overflow = 'hidden'
</script>

<div
    class:darkmode={$darkMode}
    class="bg-surface dark:bg-surface-dark border border-solid border-stroke dark:border-stroke-dark rounded-2xl overflow-{overflow} {classes}"
>
    <slot />
</div>
