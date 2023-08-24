<script lang="ts">
    import { shouldBeDarkMode } from '@core/app'
    import { appSettings } from '@core/app/stores'
    import { Animation } from '@ui'
    import { onMount } from 'svelte'

    /**
     * NOTE: This reactive dependency ensures that darkMode is set to the
     * correct value in the case that the system's settings have changed since
     * the app was last opened.
     */
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)

    onMount(() => {
        // void pollChrysalisSnapshot()
    })
</script>

<div class="w-full h-full flex justify-center items-center bg-white dark:bg-gray-900">
    <div class="w-1/3">
        <Animation classes="w-full h-auto" animation="splashscreen-desktop" loop={false} renderer="canvas" />
    </div>
</div>
