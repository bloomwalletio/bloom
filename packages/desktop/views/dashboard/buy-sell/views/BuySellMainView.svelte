<script lang="ts">
    import { ISettingsState, settingsState } from '@contexts/settings/stores'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { activeProfile } from '@core/profile/stores'
    import { IPopupState, IProfileAuthPopupState, popupState, profileAuthPopup } from '@desktop/auxiliary/popup'
    import { onDestroy, onMount, tick } from 'svelte'
    import {
        TransakAccountPanel,
        TransakConnectionPanel,
        TransakInfoPanel,
        TransakWindowPlaceholder,
    } from '../components'
    import { isDashboardSideBarExpanded } from '@core/ui'
    import { FiatCurrency, MarketCoinId } from '@core/market/enums'
    import { MarketCurrency } from '@core/market/types'
    import { marketCoinPrices } from '@core/market/stores'
    import { DrawerState } from '@desktop/auxiliary/drawer/types'
    import { drawerState } from '@desktop/auxiliary/drawer/stores'

    let isTransakOpen: boolean = false
    let isTransakLoading: boolean = true

    $: $isDashboardSideBarExpanded, void updateTransakBounds()

    $: if ($selectedAccountIndex !== undefined) {
        void resetTransak()
    }

    $: isTransakOpen, void handleOverlayChanges($popupState, $profileAuthPopup, $settingsState, $drawerState)

    async function handleOverlayChanges(
        state: IPopupState,
        profilePopupState: IProfileAuthPopupState,
        settingsState: ISettingsState,
        drawerState: DrawerState
    ): Promise<void> {
        if (state.active || profilePopupState.active || settingsState.open || drawerState?.id) {
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

    function getDefaultFiatAmount(currency: MarketCurrency): number {
        const DEFAULT_FIAT_AMOUNT = 1000
        switch (currency) {
            case FiatCurrency.USD:
            case FiatCurrency.EUR:
            case FiatCurrency.GBP:
                return DEFAULT_FIAT_AMOUNT
            default: {
                const conversionRate =
                    $marketCoinPrices[MarketCoinId.Iota]?.[currency] /
                    $marketCoinPrices[MarketCoinId.Iota]?.[FiatCurrency.USD]
                const fiatAmount = DEFAULT_FIAT_AMOUNT * conversionRate
                const roundedAmount = customRound(fiatAmount)
                return roundedAmount
            }
        }
    }

    function customRound(number) {
        const magnitude = Math.pow(10, Math.floor(Math.log10(number)))
        return magnitude <= 10
            ? Math.round(number / magnitude) * magnitude
            : Math.round((number / magnitude) * 10) * (magnitude / 10)
    }

    async function resetTransak(): Promise<void> {
        isTransakLoading = true
        await Platform.closeTransak()
        isTransakOpen = false
        await Platform.openTransak({
            currency: $activeProfile?.settings.marketCurrency,
            address: $selectedAccount.depositAddress,
            service: 'BUY',
            amount: getDefaultFiatAmount($activeProfile?.settings.marketCurrency ?? FiatCurrency.USD),
        })
        isTransakOpen = true
        await updateTransakBounds()
    }

    onMount(() => {
        Platform.onEvent('reset-transak', resetTransak)
    })

    onDestroy(() => {
        void Platform.closeTransak()
        isTransakOpen = false
        Platform.removeListenersForEvent('reset-transak')
    })
</script>

<svelte:window on:resize={updateTransakBounds} />

<div class="flex justify-center gap-4 h-full w-full">
    <div class="account-panel flex flex-col gap-4">
        <TransakConnectionPanel refreshFunction={resetTransak} />
        <TransakAccountPanel />
    </div>
    <div class="transak-panel" bind:this={transakContainer}>
        <TransakWindowPlaceholder bind:loading={isTransakLoading} />
    </div>
    <div class="info-panel">
        <TransakInfoPanel />
    </div>
</div>

<style lang="postcss">
    .transak-panel {
        @apply flex-1 min-w-[360px] max-w-[480px] max-h-[786px];
    }

    .account-panel,
    .info-panel {
        @apply max-w-[312px];
    }

    .account-panel {
        @apply shrink-0 w-[312px];
    }
</style>
