import { IEvmNetwork, IscChain, getIscChains } from '@core/network'

export function getNetworkFromAddress(networkAddress: string | undefined): IEvmNetwork | undefined {
    const evmNetwork = getIscChains().find((evmNetwork) => (evmNetwork as IscChain).aliasAddress === networkAddress)
    return evmNetwork
}
