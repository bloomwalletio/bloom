<script lang="ts">
    import { selectedExchangeCryptoCurrency, transakCryptoCurrencies, TransakCryptoCurrency } from '@auxiliary/transak'
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { networks } from '@core/network'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { SearchInput } from '@ui'
    import { TransakCryptoCurrencyTile } from '@views/dashboard/buy-sell/components'

    let searchValue: string = ''
    let selectedToken = $selectedExchangeCryptoCurrency

    const options = [
        { value: 'all', label: localize('popups.transaction.allNetworks') },
        ...($networks?.reduce((acc, network) => {
            if (!acc.find((option) => option.value === network.id)) {
                acc.push({
                    value: network.id,
                    label: network.name,
                })
            }
            return acc
        }, [] as IOption[]) ?? []),
    ]
    let selectedOption = options[0]

    let filteredCryptoCurrencies = $transakCryptoCurrencies
    function setFilteredfilteredCryptoCurrencies(): void {
        if (selectedOption.value === 'all') {
            filteredCryptoCurrencies = $transakCryptoCurrencies?.filter((cryptoCurrency) => {
                const _searchValue = searchValue.toLowerCase()
                return (
                    cryptoCurrency.name.toLowerCase().includes(_searchValue) ||
                    cryptoCurrency.symbol.toLowerCase().includes(_searchValue)
                )
            })
        } else {
            filteredCryptoCurrencies = $transakCryptoCurrencies?.filter((cryptoCurrency) => {
                // TODO: map key to transak network name or compare chain id if possible?
                const isInNetwork = cryptoCurrency.network.id === selectedOption.value

                const _searchValue = searchValue.toLowerCase()
                const isSearched =
                    cryptoCurrency.name.toLowerCase().includes(_searchValue) ||
                    cryptoCurrency.symbol.toLowerCase().includes(_searchValue)

                return isInNetwork && isSearched
            })
        }
    }
    $: $transakCryptoCurrencies, searchValue, selectedOption, setFilteredfilteredCryptoCurrencies()

    function onCryptoCurrencyClick(cryptoCurrency: TransakCryptoCurrency): void {
        try {
            if (cryptoCurrency === $selectedExchangeCryptoCurrency) {
                onContinueClick()
            } else {
                selectedToken = cryptoCurrency
            }
        } catch (err) {
            handleError(err)
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    function onContinueClick(): void {
        $selectedExchangeCryptoCurrency = selectedToken
        closePopup()
    }
</script>

<PopupTemplate
    title={localize('popups.transaction.selectToken')}
    backButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !selectedToken,
    }}
>
    <div class="flex-1 h-0 flex flex-col gap-4">
        <div class="flex-none flex flex-col gap-4">
            {#if $networks.length > 1}
                <SelectInput bind:selected={selectedOption} {options} hideValue />
            {/if}
            <SearchInput bind:value={searchValue} />
        </div>
        <div class="-mr-3 overflow-y-scroll">
            <token-list class="flex flex-col p-0.5 pr-1.5 gap-2">
                {#each filteredCryptoCurrencies ?? [] as cryptoCurrency}
                    {@const selected =
                        selectedToken?.name === cryptoCurrency.name &&
                        selectedToken?.network.id === cryptoCurrency?.network.id}
                    <TransakCryptoCurrencyTile
                        {cryptoCurrency}
                        onClick={() => onCryptoCurrencyClick(cryptoCurrency)}
                        {selected}
                    />
                {/each}
            </token-list>
        </div>
    </div>
</PopupTemplate>
