import { getActiveProfile } from '@core/profile/stores'
import { EvmNetworkType, IIscpEvmNetworkConfiguration } from '@core/network'

export function getLayer2NetworkFromAddress(address: string): string | undefined {
    const chainConfigurations = getActiveProfile()?.network?.chainConfigurations
    const iscpNetworks = chainConfigurations?.filter(
        (evmNetwork) => evmNetwork.type === EvmNetworkType.Iscp
    ) as IIscpEvmNetworkConfiguration[]
    const network = iscpNetworks?.find((evmNetwork) => evmNetwork.aliasAddress === address)
    return network?.name
}
