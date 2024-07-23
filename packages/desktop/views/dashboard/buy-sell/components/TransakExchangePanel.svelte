<script lang="ts">
    import {
        getTransakPrice,
        selectedExchangeCryptoCurrency,
        transakCryptoCurrencies,
        TransakCryptoCurrency,
        TransakFiatCurrencies,
        transakFiatCurrencies,
    } from '@auxiliary/transak'
    import { Button, IconName, IOption, SelectInput, Tabs, Text } from '@bloomwalletio/ui'
    import { getAddressFromAccountForNetwork, IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { FiatCurrency } from '@core/market'
    import { MarketCoinId } from '@core/market/enums'
    import { marketCoinPrices } from '@core/market/stores'
    import { isEvmNetwork } from '@core/network'
    import { Subject, SubjectType } from '@core/wallet'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { isFeatureEnabled } from '@lib/features/utils'
    import { Pane, RecipientInput } from '@ui'
    import { onDestroy } from 'svelte'
    import { TransakAmountInput, TransakCryptoCurrencyTile } from './'
    import TransakCryptoCurrencyAmountTile from './TransakCryptoCurrencyAmountTile.svelte'

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
                    ($marketCoinPrices?.[MarketCoinId.Iota]?.[currency] ?? 1) /
                    ($marketCoinPrices?.[MarketCoinId.Iota]?.[FiatCurrency.USD] ?? 1)
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
    function onTokenTileClick(): void {
        openPopup({ id: PopupId.TransakSelectToken })
    }

    function onButtonClick(): void {
        openPopup({
            id: PopupId.TransakFrame,
            props: {
                isBuyOrSell: selectedTab.key as 'BUY' | 'SELL',
                fiatAmount: Number(fiatValue),
                fiatCurrency: selectedCurrency,
                cryptoCurrency: selectedCryptoCurrency,
                paymentMethod: selectedPaymentOption?.value ?? '',
                recipientAddress: selectedRecipient?.address ?? '',
            },
            confirmClickOutside: true,
        })
    }
    $: isButtonDisabled = !selectedCryptoCurrency || !selectedPaymentOption || !selectedRecipient

    onDestroy(() => {
        $selectedExchangeCryptoCurrency = undefined
    })
</script>

<Pane
    classes="px-6 pb-6 pt-4 bg-surface dark:bg-surface-dark shadow-lg w-full h-full grid grid-cols-2 divide-x divide-solid divide-stroke"
>
    {@const hasCryptoCurrencies = $transakCryptoCurrencies && $transakCryptoCurrencies.length > 0}
    <div class="pr-4">
        <div class="flex flex-col justify-between items-center w-full h-full gap-8">
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
    </div>
    <div class="w-full h-full flex flex-col justify-between pl-4">
        <div class="flex flex-col gap-3">
            <div class="flex flex-col items-center gap-2">
                <Text type="h6" align="center">Quotations</Text>
                <Text type="body2" textColor="secondary" align="center">How would you like to buy your crypto?</Text>
            </div>
            <TransakCryptoCurrencyAmountTile
                cryptoCurrency={selectedCryptoCurrency}
                fiatAmount={quote?.fiatAmount}
                fiatSymbol={selectedCurrency}
                cryptoAmount={quote?.cryptoAmount}
            />
        </div>
        <Button text={selectedTab.value} on:click={onButtonClick} width="full" disabled={isButtonDisabled} />
    </div>
</Pane>
