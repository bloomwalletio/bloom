<script lang="ts">
    import { Scroller } from '@components'
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
        <Scroller classes="w-full md:w-3/4 h-full md:pr-100" threshold={100}>
            <div class="md:w-11/12">
                <SettingsListForCategory category={$settingsRoute} />
            </div>
        </Scroller>
    </div>
</settings-viewer>
