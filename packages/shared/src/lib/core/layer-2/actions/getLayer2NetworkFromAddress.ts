import { getIscChains } from '@core/network'

export function getLayer2NetworkFromAddress(address: string): string | undefined {
    const iscChains = getIscChains()
    const network = iscChains?.find(({ aliasAddress }) => aliasAddress === address)
    return network?.name
}
