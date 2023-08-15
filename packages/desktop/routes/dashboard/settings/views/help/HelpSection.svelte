<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { Text } from '@ui'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app'
    import { HelpAndInfoRoute } from '@core/router'

    export let route: HelpAndInfoRoute
    export let url: string
    export let actionLocale: string

    function onClick(): void {
        openUrlInBrowser(url)
    }
</script>

<Text type="h4" classes="mb-3">{localize(`views.settings.${route}.title`)}</Text>
<Text type="p" secondary classes="mb-5">{localize(`views.settings.${route}.description`)}</Text>
<Button on:click={onClick} text={localize(`actions.${actionLocale}`)} />
