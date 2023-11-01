<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app'
    import { HelpRoute } from '@core/router'
    import SettingsSection from '../SettingsSection.svelte'

    export let route: HelpRoute
    export let url: string
    export let actionLocale: string

    function onClick(): void {
        openUrlInBrowser(url)
    }
</script>

<SettingsSection
    title={localize(`views.settings.${route}.title`)}
    description={localize(`views.settings.${route}.description`)}
>
    <Button on:click={onClick} text={localize(`actions.${actionLocale}`)} />
</SettingsSection>
