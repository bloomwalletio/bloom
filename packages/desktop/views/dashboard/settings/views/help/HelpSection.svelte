<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app'
    import { HelpRoute } from '@core/router'

    export let route: HelpRoute
    export let url: string
    export let actionLocale: string

    function onClick(): void {
        openUrlInBrowser(url)
    }
</script>

<Text type="body2" class="mb-2">{localize(`views.settings.${route}.title`)}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize(`views.settings.${route}.description`)}</Text>
<Button on:click={onClick} text={localize(`actions.${actionLocale}`)} />
