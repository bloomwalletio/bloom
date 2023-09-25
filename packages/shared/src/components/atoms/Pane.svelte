<script lang="ts">
    import { appSettings } from '@core/app/stores'

    export let classes = ''
    export let overflow = 'hidden'

    let darkModeEnabled: boolean
    $: darkModeEnabled = $appSettings.darkMode
</script>

<div
    class:darkmode={darkModeEnabled}
    class="bg-surface-0 border border-solid border-stroke rounded-2xl overflow-{overflow} shadow-elevation-1 {classes}"
>
    <slot />
</div>
