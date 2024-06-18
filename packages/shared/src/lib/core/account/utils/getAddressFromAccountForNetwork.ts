import { DEFAULT_COIN_TYPE, ETHEREUM_COIN_TYPE, NetworkId, getEvmNetwork, isStardustNetwork } from '@core/network'
import { IAccountState } from '../interfaces'

export function getAddressFromAccountForNetwork(account: IAccountState, networkId: NetworkId): string | undefined {
    if (isStardustNetwork(networkId)) {
        return account.depositAddress
    } else {
        const coinType = getEvmNetwork(networkId)?.coinType ?? DEFAULT_COIN_TYPE[networkId] ?? ETHEREUM_COIN_TYPE
        return coinType !== undefined ? account.evmAddresses[coinType] : undefined
    }
}
