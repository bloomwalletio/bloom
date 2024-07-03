<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { CryptoCurrency, FiatCurrency, MarketCurrency } from '@core/market'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'

    const options: IOption[] = [...Object.values(FiatCurrency), ...Object.values(CryptoCurrency)]
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

<SettingsSection
    title={localize('views.settings.currency.title')}
    description={localize('views.settings.currency.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.currency.title')}
            bind:selected
            value={selected.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
