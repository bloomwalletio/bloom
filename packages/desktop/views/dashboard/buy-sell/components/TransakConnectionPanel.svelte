<script lang="ts">
    import { TRANSAK_WIDGET_URL } from '@auxiliary/transak'
    import { TransakConnectionStatus } from '@auxiliary/transak/enums'
    import { IconButton, IconName, Pill, Text, TooltipIcon, Tooltip } from '@bloomwalletio/ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { Pane } from '@ui'
    import { tick } from 'svelte'

    export let refreshFunction: () => Promise<void>

    let refreshButton: HTMLElement
    let textContainer: HTMLElement
    let showTextTooltip: boolean = false

    let url = ''
    Platform.onEvent('transak-url', (transakUrl) => (url = transakUrl))

    $: connectionStatus = getConnectionStatus(url)

    $: url, void updateShowTextTooltip(textContainer)

    function getConnectionStatus(url: string): TransakConnectionStatus {
        const _url = URL.canParse(url) ? new URL(url) : null
        if (_url?.origin === TRANSAK_WIDGET_URL) {
            return TransakConnectionStatus.Connected
        } else if (url) {
            return TransakConnectionStatus.Redirected
        } else if (!url) {
            return TransakConnectionStatus.Waiting
        } else {
            return TransakConnectionStatus.Disconnected
        }
    }

    async function updateShowTextTooltip(element: HTMLElement): Promise<void> {
        await tick()
        showTextTooltip =
            ((element?.firstChild as HTMLElement)?.scrollWidth ?? 0) >
            ((element?.firstChild as HTMLElement)?.offsetWidth ?? 0)
    }
</script>

<Pane classes="flex flex-col items-center w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    <div class="w-full flex justify-between items-center h-8">
        <img data-label="transak-logo" width="90" height="28" src="assets/logos/transak.svg" alt="Transak" />
        <div>
            {#if connectionStatus === TransakConnectionStatus.Connected}
                <Pill color="success">{localize('general.connected')}</Pill>
            {:else if connectionStatus === TransakConnectionStatus.Redirected}
                <Pill color="warning">{localize('general.redirected')}</Pill>
            {:else if connectionStatus === TransakConnectionStatus.Waiting}
                <Pill color="neutral">{localize('general.waitingConnection')}</Pill>
            {:else}
                <Pill color="danger">{localize('general.disconnected')}</Pill>
            {/if}
        </div>
    </div>
    <div class="flex flex-row justify-between w-full items-center">
        <div class="flex items-center gap-1 w-full h-3">
            {#if connectionStatus === TransakConnectionStatus.Connected}
                <TooltipIcon
                    icon={IconName.ShieldOn}
                    textColor="success"
                    size="xs"
                    tooltip={localize('views.buySell.tooltip.connected')}
                />
            {:else if connectionStatus === TransakConnectionStatus.Redirected}
                <TooltipIcon
                    icon={IconName.DangerTriangle}
                    textColor="warning"
                    size="xs"
                    tooltip={localize('views.buySell.tooltip.redirected')}
                />
            {:else if connectionStatus === TransakConnectionStatus.Waiting}
                <TooltipIcon
                    icon={IconName.Globe}
                    textColor="secondary"
                    size="xs"
                    tooltip={localize('general.waitingConnection')}
                />
            {:else}
                <TooltipIcon
                    icon={IconName.DangerCircle}
                    textColor="danger"
                    size="xs"
                    tooltip={localize('views.buySell.tooltip.disconnected')}
                />
            {/if}
            <div bind:this={textContainer} class="truncate">
                <Text type="sm" textColor="secondary" truncate>{url ?? TRANSAK_WIDGET_URL}</Text>
            </div>
            {#if showTextTooltip}
                <Tooltip anchor={textContainer} event="hover" placement="top" text={url ?? TRANSAK_WIDGET_URL} />
            {/if}
        </div>
        {#if connectionStatus !== TransakConnectionStatus.Waiting}
            <Tooltip anchor={refreshButton} text={localize('actions.refresh')} event="hover" placement="top" />
            <div bind:this={refreshButton}>
                <IconButton icon={IconName.Refresh} size="xs" on:click={refreshFunction} />
            </div>
        {/if}
    </div>
</Pane>
