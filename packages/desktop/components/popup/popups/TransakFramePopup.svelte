<script lang="ts">
    import { TransakCryptoCurrency } from '@auxiliary/transak'
    import { Button, Icon, IconName, Spinner, Text } from '@bloomwalletio/ui'
    import { DISCORD_URL } from '@contexts/settings'
    import { selectedAccountIndex } from '@core/account/stores'
    import { openUrlInBrowser, Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { FiatCurrency } from '@core/market'
    import { IPopupState, popupState } from '@desktop/auxiliary/popup'
    import { TransakConnectionBanner } from '@views/dashboard/buy-sell/components'
    import { onDestroy, onMount, tick } from 'svelte'

    export let isBuyOrSell: 'BUY' | 'SELL' | undefined = undefined
    export let fiatAmount: number | undefined = undefined
    export let fiatCurrency: keyof typeof FiatCurrency | undefined = undefined
    export let cryptoCurrency: TransakCryptoCurrency | undefined = undefined
    export let paymentMethod: string | undefined = undefined
    export let recipientAddress: string | undefined = undefined

    let error: boolean = false
    let isTransakOpen: boolean = false
    let isTransakLoading: boolean = false

    $: if ($selectedAccountIndex !== undefined) {
        void closeTransak()
    }
    $: isTransakOpen, void handleOverlayChanges($popupState)

    Platform.onEvent('transak-loaded', () => (isTransakLoading = false))
    Platform.onEvent('transak-not-loaded', () => (error = true))

    async function handleOverlayChanges(state: IPopupState): Promise<void> {
        if (!state.confirmClickOutside) {
            return
        }

        if (state.confirmClickOutsideActive) {
            await Platform.hideTransak()
        } else {
            await tick()
            await Platform.showTransak()
        }
    }

    let transakContainer: HTMLDivElement | undefined
    async function updateTransakBounds(): Promise<void> {
        if (!transakContainer) {
            return
        }

        const rect = transakContainer.getBoundingClientRect()
        const transakPaneStyles = getComputedStyle(transakContainer?.children[0])
        const extractDigitsToNumbers = (str: string) => Number(str?.replace(/\D/g, '') ?? 0)
        const borderTop = extractDigitsToNumbers(transakPaneStyles?.borderTopWidth)
        const borderBottom = extractDigitsToNumbers(transakPaneStyles?.borderBottomWidth)
        const borderLeft = extractDigitsToNumbers(transakPaneStyles?.borderLeftWidth)
        const borderRight = extractDigitsToNumbers(transakPaneStyles?.borderRightWidth)

        await Platform.updateTransakBounds({
            x: rect.x + borderLeft,
            y: rect.y + borderTop,
            width: rect.width - borderLeft - borderRight,
            height: rect.height - borderTop - borderBottom,
        })
    }

    export async function resetTransak(): Promise<void> {
        if (!fiatCurrency || !cryptoCurrency || !recipientAddress || !isBuyOrSell || !fiatAmount || !paymentMethod) {
            error = true
            return
        }

        isTransakLoading = true
        await Platform.closeTransak()
        isTransakOpen = false
        await Platform.openTransak({
            currency: fiatCurrency,
            address: recipientAddress,
            service: isBuyOrSell,
            amount: Number(fiatAmount),
            paymentMethod: paymentMethod,
            networkName: cryptoCurrency.transakNetworkName,
            cryptoCurrencySymbol: cryptoCurrency.symbol,
        })
        isTransakOpen = true
        await updateTransakBounds()
    }

    async function closeTransak(): Promise<void> {
        await Platform.closeTransak()
        isTransakOpen = false
    }

    function onButtonClick(): void {
        openUrlInBrowser(DISCORD_URL)
    }

    onMount(() => {
        void resetTransak()
    })

    onDestroy(() => {
        void Platform.closeTransak()
        isTransakOpen = false
        Platform.removeListenersForEvent('reset-transak')
    })
</script>

<svelte:window on:resize={updateTransakBounds} />

<div class="flex flex-col gap-4">
    <div class="border-b border-solid border-stroke dark:border-stroke-dark">
        <TransakConnectionBanner refreshFunction={resetTransak} />
    </div>
    <div class="w-[30rem] h-[60vh]" bind:this={transakContainer}>
        {#if error}
            <div class="flex flex-col justify-center items-center w-full h-full gap-4 px-10">
                <Icon name={IconName.ArrowDownUp} size="lg" textColor="brand" />
                <Text type="body1">{localize('views.buySell.error.title')}</Text>
                <Text textColor="secondary" align="center">{localize('views.buySell.error.description')}</Text>
                <Button on:click={onButtonClick} text={localize('actions.visitDiscord')} />
            </div>
        {:else if isTransakLoading}
            <div class="w-full h-full flex justify-center items-center">
                <Spinner size="lg" textColor="info" />
            </div>
        {/if}
    </div>
</div>
