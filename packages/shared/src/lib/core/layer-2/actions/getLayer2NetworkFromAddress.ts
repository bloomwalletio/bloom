import { getActiveProfile } from '@core/profile/stores'

export function getLayer2NetworkFromAddress(address: string): string | undefined {
    const chainConfigurations = getActiveProfile()?.network?.chainConfigurations
    const network = chainConfigurations?.find(({ aliasAddress }) => aliasAddress === address)
    return network?.name
}
