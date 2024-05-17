import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { NetworkId } from '@core/network'
import { toChecksumAddress } from '@ethereumjs/util'

export function buildAccountForWalletConnect(account: IAccountState, networkId: NetworkId): string | undefined {
    const accountAddress = getAddressFromAccountForNetwork(account, networkId)
    return accountAddress ? `${networkId}:${toChecksumAddress(accountAddress)}` : undefined
}
