<script lang="ts">
    import { Icon, IconName, Pill, Spinner, Text } from '@bloomwalletio/ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { Pane } from '@ui'

    let url = ''
    Platform.onEvent('transak-url', (transakUrl) => (url = transakUrl))
</script>

<Pane classes="flex flex-col items-center w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    {@const isTransakUrl = url.includes('transak.com')}
    {@const isEmptyUrl = !url}
    <div class="w-full flex justify-between items-center h-8">
        {#if isTransakUrl}
            <img data-label="transak-logo" width="90" height="29" src="assets/logos/transak.png" alt="Transak" />
        {:else if isEmptyUrl}
            <Spinner size="md" textColor="primary" />
        {:else}
            <Icon name={IconName.Globe} textColor="secondary" size="md" />
        {/if}
        <div>
            {#if !isEmptyUrl}
                <Pill color="success">{localize('general.connected')}</Pill>
            {:else}
                <Pill color="danger">{localize('general.disconnected')}</Pill>
            {/if}
        </div>
    </div>
    <div class="flex items-center gap-1 w-full h-3">
        {#if isTransakUrl}
            <Icon name={IconName.ShieldOn} textColor="success" size="xxs" />
        {:else if !isEmptyUrl}
            <Icon name={IconName.DangerTriangle} textColor="danger" size="xxs" />
        {/if}
        <Text type="sm" textColor="secondary">{url}</Text>
    </div>
</Pane>
