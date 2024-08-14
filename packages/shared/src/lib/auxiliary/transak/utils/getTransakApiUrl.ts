import { SupportedNetworkId } from '@core/network'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { TRANSAK_API_PRODUCTION_BASE_URL, TRANSAK_API_STAGING_BASE_URL } from '../constants'

export function getTransakApiUrl(): string {
    const currentNetworkId = get(activeProfile)?.network?.id
    const isTestnet = [SupportedNetworkId.IotaTestnet, SupportedNetworkId.Testnet].includes(currentNetworkId)

    return isTestnet ? TRANSAK_API_STAGING_BASE_URL : TRANSAK_API_PRODUCTION_BASE_URL
}
