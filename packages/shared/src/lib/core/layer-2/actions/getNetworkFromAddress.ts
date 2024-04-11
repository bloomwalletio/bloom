import { IChain, IscpChain, getIscpChains } from '@core/network'

export function getNetworkFromAddress(networkAddress: string | undefined): IChain | undefined {
    const chain = getIscpChains().find((chain) => (chain as IscpChain).aliasAddress === networkAddress)
    return chain
}
