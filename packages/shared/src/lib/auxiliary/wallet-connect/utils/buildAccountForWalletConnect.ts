import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { NetworkId } from '@core/network'
import { toChecksumAddress } from '@ethereumjs/util'

export function buildAccountForWalletConnect(account: IAccountState, networkId: NetworkId): string | undefined {
    // TODO: make address mixed case according to EIP55
    // Required for notifications
    const accountAddress = getAddressFromAccountForNetwork(account, networkId)
    return accountAddress ? `${networkId}:${toChecksumAddress(accountAddress)}` : undefined
}
