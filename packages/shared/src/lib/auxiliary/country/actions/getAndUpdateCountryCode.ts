import { CountryApi } from '../api'
import { updateCountryCode } from '../stores'

export async function getAndUpdateCountryCode(): Promise<void> {
    const api = new CountryApi()
    const countryCode = await api.getCountryCode()
    updateCountryCode(countryCode)
}
