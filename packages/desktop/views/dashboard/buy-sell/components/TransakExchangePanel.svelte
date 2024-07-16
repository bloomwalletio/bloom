<script lang="ts">
    import { Button, Icon, IconName, IOption, SelectInput, Tabs, Text } from '@bloomwalletio/ui'
    import { DISCORD_URL } from '@contexts/settings/constants'
    import { ISettingsState, settingsState } from '@contexts/settings/stores'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { openUrlInBrowser, Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { FiatCurrency } from '@core/market'
    import { MarketCoinId } from '@core/market/enums'
    import { marketCoinPrices } from '@core/market/stores'
    import { isDashboardSideBarExpanded } from '@core/ui'
    import { drawerState } from '@desktop/auxiliary/drawer/stores'
    import { DrawerState } from '@desktop/auxiliary/drawer/types'
    import {
        IPopupState,
        IProfileAuthPopupState,
        openPopup,
        PopupId,
        popupState,
        profileAuthPopup,
    } from '@desktop/auxiliary/popup'
    import { isFeatureEnabled } from '@lib/features/utils'
    import { Pane } from '@ui'
    import { onDestroy, tick } from 'svelte'
    import { TransakCryptoCurrencyTile, TransakAmountInput } from './'
    import { selectedExchangeCryptoCurrency, transakCryptoCurrencies, transakFiatCurrencies } from '@auxiliary/transak'

    const CURRENCY_OPTIONS: IOption[] = Object.keys(FiatCurrency).map((currency) => ({
        value: currency,
    }))
    let selectedCurrencyOption: IOption = CURRENCY_OPTIONS[0]

    let error: boolean = false

    $: fiatValue = String(getDefaultFiatAmount(FiatCurrency[selectedCurrencyOption.value as keyof typeof FiatCurrency]))

    Platform.onEvent('transak-loaded', () => (isTransakLoading = false))
    Platform.onEvent('transak-not-loaded', () => (error = true))

    function onButtonClick(): void {
        openUrlInBrowser(DISCORD_URL)
    }

    const TABS = [
        { key: 'BUY', value: localize('views.buySell.tabs.buy') },
        { key: 'SELL', value: localize('views.buySell.tabs.sell') },
    ]

    let selectedTab = TABS[0]

    $: paymentOptions =
        $transakFiatCurrencies?.[selectedCurrency as keyof typeof FiatCurrency]?.paymentOptions.map((option) => ({
            value: option.id,
            label: option.name,
        })) ?? []
    $: selectedPaymentOption = paymentOptions?.[0]

    $: selectedCurrency = selectedCurrencyOption.value

    let isTransakOpen: boolean = false
    let isTransakLoading: boolean = false

    $: $isDashboardSideBarExpanded, void updateTransakBounds()

    $: if ($selectedAccountIndex !== undefined) {
        void closeTransak()
    }

    $: isTransakOpen, void handleOverlayChanges($popupState, $profileAuthPopup, $settingsState, $drawerState)

    async function handleOverlayChanges(
        state: IPopupState,
        profilePopupState: IProfileAuthPopupState,
        settingsState: ISettingsState,
        drawerState: DrawerState | undefined
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

    function getDefaultFiatAmount(currency: FiatCurrency): number {
        const DEFAULT_FIAT_AMOUNT = 100
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

    export async function resetTransak(): Promise<void> {
        isTransakLoading = true
        await Platform.closeTransak()
        isTransakOpen = false
        await Platform.openTransak({
            currency: selectedCurrencyOption.value as keyof typeof FiatCurrency,
            address: $selectedAccount?.depositAddress ?? '',
            service: selectedTab.key as 'BUY' | 'SELL',
            amount: Number(fiatValue),
            paymentMethod: selectedPaymentOption.value ?? '',
            networkName:
                $selectedExchangeCryptoCurrency?.networkName ?? $transakCryptoCurrencies?.[0]?.networkName ?? 'miota',
            cryptoCurrencySymbol:
                $selectedExchangeCryptoCurrency?.symbol ?? $transakCryptoCurrencies?.[0]?.symbol ?? 'IOTA',
        })
        isTransakOpen = true
        await updateTransakBounds()
    }

    async function closeTransak(): Promise<void> {
        await Platform.closeTransak()
        isTransakOpen = false
    }

    function onTokenTileClick(): void {
        openPopup({ id: PopupId.TransakSelectToken })
    }

    onDestroy(() => {
        void Platform.closeTransak()
        isTransakOpen = false
        Platform.removeListenersForEvent('reset-transak')
    })
</script>

<svelte:window on:resize={updateTransakBounds} />

<div class="w-full h-full" bind:this={transakContainer}>
    <Pane classes="px-6 pb-6 pt-4 bg-surface dark:bg-surface-dark shadow-lg w-full h-full">
        {#if error}
            <div class="flex flex-col justify-center items-center w-full h-full gap-4">
                <Icon name={IconName.ArrowDownUp} size="lg" textColor="brand" />
                <Text type="body1">{localize('views.buySell.error.title')}</Text>
                <Text textColor="secondary" align="center">{localize('views.buySell.error.description')}</Text>
                <Button on:click={onButtonClick} text={localize('actions.visitDiscord')} />
            </div>
        {:else}
            <div
                class="flex flex-col justify-between items-center w-full h-full gap-8 {isTransakOpen &&
                !isTransakLoading
                    ? 'opacity-0 pointer-events-none'
                    : ''}"
            >
                {#if isFeatureEnabled('buySell.sell')}
                    <div class="w-full">
                        <Tabs bind:selectedTab tabs={TABS} />
                    </div>
                {/if}
                <div class="flex flex-col items-center gap-4 w-full">
                    <div class="w-28 self-end">
                        <SelectInput
                            label="Currency"
                            options={CURRENCY_OPTIONS}
                            bind:selected={selectedCurrencyOption}
                        />
                    </div>
                    <TransakAmountInput currency={selectedCurrency} bind:value={fiatValue} />
                    {#if $transakCryptoCurrencies && $transakCryptoCurrencies.length > 0}
                        <TransakCryptoCurrencyTile
                            cryptoCurrency={$selectedExchangeCryptoCurrency ?? $transakCryptoCurrencies[0]}
                            onClick={onTokenTileClick}
                        />
                    {/if}
                    <div class="w-full">
                        <SelectInput
                            label="Payment method"
                            options={paymentOptions}
                            bind:selected={selectedPaymentOption}
                            hideValue
                        />
                    </div>
                </div>
                <Button text={selectedTab.value} on:click={resetTransak} width="full" />
            </div>
        {/if}
    </Pane>
</div>
