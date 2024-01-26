import { IIscpChainConfiguration, NetworkId, getNetwork } from '@core/network'

export function getNetworkIdFromAddress(networkAddress: string | undefined): NetworkId | undefined {
    const network = getNetwork()
    const chains = network?.getIscpChains()
    const chain = chains?.find(
        (chain) => (chain?.getConfiguration() as IIscpChainConfiguration).aliasAddress === networkAddress
    )
    return chain?.getConfiguration()?.id
}
