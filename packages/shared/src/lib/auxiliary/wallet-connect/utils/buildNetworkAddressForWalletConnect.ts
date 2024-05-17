import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { EvmNetworkId } from '@core/network'
import { toChecksumAddress } from '@ethereumjs/util'

export function buildNetworkAddressForWalletConnect(
    account: IAccountState,
    evmNetworkId: EvmNetworkId
): string | undefined {
    const accountAddress = getAddressFromAccountForNetwork(account, evmNetworkId)
    return accountAddress ? `${evmNetworkId}:${toChecksumAddress(accountAddress)}` : undefined
}
