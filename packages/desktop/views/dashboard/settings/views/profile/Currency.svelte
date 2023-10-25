<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { MarketCurrency } from '@core/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'

    const options: IOption[] = Object.values(MarketCurrency)
        .map((currency) => ({ value: currency, label: currency.toUpperCase() }))
        .sort()

    let selected: IOption = options.find((option) => option.value === $activeProfile?.settings?.marketCurrency)
    $: onCurrencyChange(selected)

    function onCurrencyChange(option: IOption | undefined): void {
        if (option) {
            updateActiveProfileSettings({ marketCurrency: option.value as MarketCurrency })
        }
    }
</script>

<Text type="body2" class="mb-2">{localize('views.settings.currency.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.currency.description')}</Text>
<SelectInput bind:selected value={selected.value} {options} />
