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
    import { Pane, RecipientInput } from '@ui'
    import { onDestroy, tick } from 'svelte'
    import { TransakCryptoCurrencyTile, TransakAmountInput } from './'
    import {
        getTransakPrice,
        selectedExchangeCryptoCurrency,
        transakCryptoCurrencies,
        TransakCryptoCurrency,
        TransakFiatCurrencies,
        transakFiatCurrencies,
    } from '@auxiliary/transak'
    import TransakCryptoCurrencyAmountTile from './TransakCryptoCurrencyAmountTile.svelte'
    import { isEvmNetwork } from '@core/network'
    import { getAddressFromAccountForNetwork, IAccountState } from '@core/account'
    import { Subject, SubjectType } from '@core/wallet'

    // Buy / Sell Tabs
    const TABS = [
        { key: 'BUY', value: localize('views.buySell.tabs.buy') },
        { key: 'SELL', value: localize('views.buySell.tabs.sell') },
    ]
    let selectedTab = TABS[0]

    // Fiat Currency Selector
    const CURRENCY_OPTIONS: IOption[] = Object.keys(FiatCurrency).map((currency) => ({
        value: currency,
    }))
    let selectedCurrencyOption: IOption = CURRENCY_OPTIONS[0]
    $: selectedCurrency = selectedCurrencyOption.value

    // Fiat Input
    function customRound(number) {
        const magnitude = Math.pow(10, Math.floor(Math.log10(number)))
        return magnitude <= 10
            ? Math.round(number / magnitude) * magnitude
            : Math.round((number / magnitude) * 10) * (magnitude / 10)
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
    let fiatValue = String(
        getDefaultFiatAmount(FiatCurrency[selectedCurrencyOption.value as keyof typeof FiatCurrency])
    )

    // Select Crypto Asset
    $: selectedCryptoCurrency = $selectedExchangeCryptoCurrency ?? $transakCryptoCurrencies?.[0]

    // Payment Options Selector
    let paymentOptions: IOption[]
    let selectedPaymentOption: IOption | undefined
    function updatePaymentOptions(
        supportedCurrencies: TransakFiatCurrencies | undefined,
        selectedCurrency: string
    ): void {
        paymentOptions =
            supportedCurrencies?.[selectedCurrency as keyof typeof FiatCurrency]?.paymentOptions.map((option) => ({
                value: option.id,
                label: option.name,
                icon: option.id.includes('card') ? IconName.CreditCard : IconName.Bank,
            })) ?? []
        if (!paymentOptions.some((paymentOption) => paymentOption.value === selectedPaymentOption?.value)) {
            selectedPaymentOption = paymentOptions?.[0]
        }
    }
    $: updatePaymentOptions($transakFiatCurrencies, selectedCurrency)

    // Recipient Input
    let recipientInput
    let selectedRecipient: Subject | undefined
    function updateSelectedRecipient(
        account: IAccountState | undefined,
        cryptoCurrency: TransakCryptoCurrency | undefined
    ) {
        if (account && cryptoCurrency) {
            const address = getAddressFromAccountForNetwork(account, cryptoCurrency.network.id)

            if (address) {
                selectedRecipient = {
                    type: SubjectType.Account,
                    account,
                    address,
                }
            } else {
                selectedRecipient = undefined
            }
        } else {
            selectedRecipient = undefined
        }
    }
    $: updateSelectedRecipient($selectedAccount, selectedCryptoCurrency)

    // Quotations
    let quote: { fiatAmount: number; cryptoAmount: number } | undefined = undefined
    let latestQuoteRequestId = 0
    async function updateQuote(): Promise<void> {
        if (!selectedPaymentOption) {
            return
        }

        const params = {
            fiatCurrency: selectedCurrency as keyof typeof FiatCurrency,
            cryptoCurrency: selectedCryptoCurrency?.symbol ?? 'IOTA',
            isBuyOrSell: selectedTab.key as 'BUY' | 'SELL',
            networkName: selectedCryptoCurrency?.network.name ?? 'miota',
            paymentMethod: selectedPaymentOption.value,
            fiatAmount: Number(fiatValue),
        }

        quote = undefined

        const requestId = ++latestQuoteRequestId // Increment the request ID
        const response = await getTransakPrice(params)

        // Only update the quote if this is the latest request
        if (requestId === latestQuoteRequestId && response) {
            quote = {
                fiatAmount: response.fiatAmount,
                cryptoAmount: response.cryptoAmount,
            }
        }
    }
    $: selectedCurrency, selectedCryptoCurrency, selectedPaymentOption, fiatValue, void updateQuote()

    // Handlers
    function onButtonClick(): void {
        openUrlInBrowser(DISCORD_URL)
    }

    function onTokenTileClick(): void {
        openPopup({ id: PopupId.TransakSelectToken })
    }

    // TODO: Transak Popup to be in its own file

    let error: boolean = false
    let isTransakOpen: boolean = false
    let isTransakLoading: boolean = false

    $: $isDashboardSideBarExpanded, void updateTransakBounds()
    $: if ($selectedAccountIndex !== undefined) {
        void closeTransak()
    }
    $: isTransakOpen, void handleOverlayChanges($popupState, $profileAuthPopup, $settingsState, $drawerState)

    Platform.onEvent('transak-loaded', () => (isTransakLoading = false))
    Platform.onEvent('transak-not-loaded', () => (error = true))

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

    export async function resetTransak(): Promise<void> {
        isTransakLoading = true
        await Platform.closeTransak()
        isTransakOpen = false
        await Platform.openTransak({
            currency: selectedCurrencyOption.value as keyof typeof FiatCurrency,
            address: $selectedAccount?.depositAddress ?? '',
            service: selectedTab.key as 'BUY' | 'SELL',
            amount: Number(fiatValue),
            paymentMethod: selectedPaymentOption?.value ?? '',
            networkName: selectedCryptoCurrency?.network.name ?? 'miota',
            cryptoCurrencySymbol: selectedCryptoCurrency?.symbol ?? 'IOTA',
        })
        isTransakOpen = true
        await updateTransakBounds()
    }

    async function closeTransak(): Promise<void> {
        await Platform.closeTransak()
        isTransakOpen = false
    }

    onDestroy(() => {
        void Platform.closeTransak()
        isTransakOpen = false
        Platform.removeListenersForEvent('reset-transak')
        $selectedExchangeCryptoCurrency = undefined
    })
</script>

<svelte:window on:resize={updateTransakBounds} />

<div class="w-full h-full" bind:this={transakContainer}>
    <Pane
        classes="px-6 pb-6 pt-4 bg-surface dark:bg-surface-dark shadow-lg w-full h-full grid grid-cols-2 divide-x divide-solid divide-stroke"
    >
        <div class="pr-4">
            {#if error}
                <div class="flex flex-col justify-center items-center w-full h-full gap-4">
                    <Icon name={IconName.ArrowDownUp} size="lg" textColor="brand" />
                    <Text type="body1">{localize('views.buySell.error.title')}</Text>
                    <Text textColor="secondary" align="center">{localize('views.buySell.error.description')}</Text>
                    <Button on:click={onButtonClick} text={localize('actions.visitDiscord')} />
                </div>
            {:else}
                {@const hasCryptoCurrencies = $transakCryptoCurrencies && $transakCryptoCurrencies.length > 0}
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
                    <div class="flex flex-col justify-between items-center gap-4 h-full w-full">
                        <div class="flex gap-2">
                            <div class="w-28">
                                <SelectInput options={CURRENCY_OPTIONS} bind:selected={selectedCurrencyOption} />
                            </div>
                            {#key paymentOptions}
                                <SelectInput options={paymentOptions} bind:selected={selectedPaymentOption} hideValue />
                            {/key}
                        </div>
                        <TransakAmountInput currency={selectedCurrency} bind:value={fiatValue} />
                        <div class="flex flex-col gap-4 w-full">
                            <TransakCryptoCurrencyTile
                                cryptoCurrency={selectedCryptoCurrency}
                                onClick={hasCryptoCurrencies ? onTokenTileClick : undefined}
                            />
                            <RecipientInput
                                bind:this={recipientInput}
                                bind:recipient={selectedRecipient}
                                networkId={selectedCryptoCurrency?.network.id}
                                isEvmNetwork={isEvmNetwork(selectedCryptoCurrency?.network.id)}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            {/if}
        </div>
        <div class="w-full h-full flex flex-col justify-between pl-4">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col items-center gap-2">
                    <Text type="h6" align="center">Quotations</Text>
                    <Text type="body2" textColor="secondary" align="center">
                        How would you like to buy your crypto?
                    </Text>
                </div>
                <TransakCryptoCurrencyAmountTile
                    cryptoCurrency={selectedCryptoCurrency}
                    fiatAmount={quote?.fiatAmount}
                    fiatSymbol={selectedCurrency}
                    cryptoAmount={quote?.cryptoAmount}
                />
            </div>
            <Button text={selectedTab.value} on:click={resetTransak} width="full" />
        </div>
    </Pane>
</div>
