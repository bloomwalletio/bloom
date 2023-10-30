<script lang="ts">
    import { settingsRoute, settingsRouter } from '@core/router'
    import { onMount } from 'svelte'
    import { SettingsListForCategory, SettingsSidebar } from './'

    function scrollIntoView(id: string, options = null): void {
        if (id) {
            const elem = document.getElementById(id)
            if (elem) {
                elem.scrollIntoView(options ?? { behavior: 'smooth' })
            } else {
                console.error(`Element with id "${id}" missing in scrollIntoView`)
            }
        }
    }

    onMount(() => {
        const child = $settingsRouter.getChildRouteAndReset()
        if (child) {
            scrollIntoView(child, { behavior: 'auto' })
        }
    })
</script>

<settings-viewer class="h-full flex flex-1 flex-row items-start">
    <SettingsSidebar />
    <div class="h-full w-full">
        <div class="scroller w-full h-full scrollable-y">
            <SettingsListForCategory category={$settingsRoute} />
        </div>
    </div>
</settings-viewer>

<style lang="postcss">
    .scroller {
        border-top: 32px transparent solid;
        border-bottom: 32px transparent solid;
    }
</style>
