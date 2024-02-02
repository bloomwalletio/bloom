<script lang="ts">
    import { TransakConnectionStatus } from '@auxiliary/transak/enums'
    import { Icon, IconButton, IconName, Pill, Text, TooltipIcon } from '@bloomwalletio/ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { Pane } from '@ui'

    export let refreshFunction: () => Promise<void>

    let url = ''
    Platform.onEvent('transak-url', (transakUrl) => (url = transakUrl))

    const TRANSAK_URL = 'https://global-stg.transak.com'

    $: connectionStatus = calculateConnectionStatus(url)

    function calculateConnectionStatus(url: string): TransakConnectionStatus {
        if (url.includes('transak.com')) {
            return TransakConnectionStatus.Connected
        } else if (url) {
            return TransakConnectionStatus.Redirected
        } else {
            return TransakConnectionStatus.Disconnected
        }
    }
</script>

<Pane classes="flex flex-col items-center w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    <div class="w-full flex justify-between items-center h-8">
        <img data-label="transak-logo" width="90" height="29" src="assets/logos/transak.png" alt="Transak" />
        <div>
            {#if connectionStatus === TransakConnectionStatus.Connected}
                <Pill color="success">{localize('general.connected')}</Pill>
            {:else if connectionStatus === TransakConnectionStatus.Redirected}
                <Pill color="warning">{localize('general.redirected')}</Pill>
            {:else}
                <Pill color="danger">{localize('general.disconnected')}</Pill>
            {/if}
        </div>
    </div>
    <div class="flex flex-row justify-between w-full items-center">
        <div class="flex items-center gap-1 w-full h-3">
            {#if connectionStatus === TransakConnectionStatus.Connected}
                <TooltipIcon icon={IconName.ShieldOn} textColor="success" size="xs" tooltip="connected securely" />
                <Text type="sm" textColor="secondary" truncate>{url}</Text>
            {:else if connectionStatus === TransakConnectionStatus.Redirected}
                <Icon name={IconName.DangerTriangle} textColor="warning" size="xs" />
                <Text type="sm" textColor="secondary" truncate>{url}</Text>
            {:else}
                <Icon name={IconName.DangerCircle} textColor="danger" size="xs" />
                <Text type="sm" textColor="secondary" truncate>{TRANSAK_URL}</Text>
            {/if}
        </div>
        <IconButton icon={IconName.Refresh} size="xs" on:click={refreshFunction} />
    </div>
</Pane>
