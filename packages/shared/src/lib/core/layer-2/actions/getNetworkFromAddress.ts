import { IEvmNetwork, IscpChain, getIscpChains } from '@core/network'

export function getNetworkFromAddress(networkAddress: string | undefined): IEvmNetwork | undefined {
    const evmNetwork = getIscpChains().find((evmNetwork) => (evmNetwork as IscpChain).aliasAddress === networkAddress)
    return evmNetwork
}
