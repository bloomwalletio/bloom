import { IpApi } from '../api'
import { updateCountryCode } from '../stores'

export async function getAndUpdateCountryCode(): Promise<void> {
    const api = new IpApi()
    const countryCode = await api.getCountryCode()
    updateCountryCode(countryCode)
}
