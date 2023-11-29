import { NetworkId, getChainConfiguration, isStardustNetwork } from '@core/network'
import { IAccountState } from '../interfaces'

export function getAddressFromAccountForNetwork(account: IAccountState, networkId: NetworkId): string | undefined {
    if (isStardustNetwork(networkId)) {
        return account.depositAddress
    } else {
        const coinType = getChainConfiguration(networkId)?.coinType
        return coinType !== undefined ? account.evmAddresses[coinType] : undefined
    }
}
