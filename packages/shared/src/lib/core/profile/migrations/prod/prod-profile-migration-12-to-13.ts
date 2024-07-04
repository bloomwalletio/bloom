import { CryptoCurrency, FiatCurrency } from '@core/market'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration12To13(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile
    const marketCurrencies = [...Object.values(FiatCurrency), ...Object.values(CryptoCurrency)]

    if (!marketCurrencies.includes(profile?.settings?.marketCurrency)) {
        profile.settings.marketCurrency = FiatCurrency.USD
    }

    return Promise.resolve()
}
