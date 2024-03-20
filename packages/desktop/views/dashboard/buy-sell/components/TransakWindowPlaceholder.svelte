<script lang="ts">
    import { Platform, openUrlInBrowser } from '@core/app'
    import { Pane } from '@ui'
    import { Button, Icon, IconName, Spinner, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DISCORD_URL } from '@contexts/settings/constants'

    let error: boolean = false
    let loading: boolean = true

    Platform.onEvent('transak-not-loaded', () => (error = true))
    Platform.onEvent('transak-loaded', () => (loading = false))

    function onButtonClick(): void {
        openUrlInBrowser(DISCORD_URL)
    }
</script>

<Pane
    classes="flex flex-col justify-center items-center w-full h-full px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg"
>
    {#if error}
        <Icon name={IconName.ArrowDownUp} size="lg" textColor="brand" />
        <Text type="body1">{localize('views.buySell.error.title')}</Text>
        <Text textColor="secondary" align="center">{localize('views.buySell.error.description')}</Text>
        <Button on:click={onButtonClick} text={localize('actions.visitDiscord')} />
    {:else if loading}
        <Spinner size="lg" textColor="info" />
    {/if}
</Pane>
