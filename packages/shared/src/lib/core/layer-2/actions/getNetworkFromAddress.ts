import { ChainConfiguration, IIscpChainConfiguration, getNetwork } from '@core/network'

export function getNetworkFromAddress(networkAddress: string | undefined): ChainConfiguration | undefined {
    const network = getNetwork()
    const chains = network?.getIscpChains()
    const chain = chains?.find(
        (chain) => (chain?.getConfiguration() as IIscpChainConfiguration).aliasAddress === networkAddress
    )
    return chain?.getConfiguration()
}
