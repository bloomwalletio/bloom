import { IscChain, getIscChains } from '@core/network'

export function getNetworkFromAddress(networkAddress: string | undefined): IscChain | undefined {
    const evmNetwork = getIscChains().find(({ aliasAddress }) => aliasAddress === networkAddress)
    return evmNetwork
}
