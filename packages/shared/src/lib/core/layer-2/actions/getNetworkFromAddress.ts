import { IChain, IscpChain, getNetwork } from '@core/network'

export function getNetworkFromAddress(networkAddress: string | undefined): IChain | undefined {
    const network = getNetwork()
    const chains = network?.getIscpChains()
    const chain = chains?.find((chain) => (chain as IscpChain).aliasAddress === networkAddress)
    return chain
}
