import { IAccountState } from '@core/account/interfaces'
import { ProfileType, updateActiveAccount, updateActiveAccountPersistedData } from '@core/profile'
import { Ledger } from '@core/ledger/classes'

export async function generateAndStoreEvmAddressForAccount(
    profileType: ProfileType,
    account: IAccountState,
    coinType: number
): Promise<string> {
    let evmAddress: string | undefined
    if (profileType === ProfileType.Software) {
        evmAddress = (
            await account.generateEvmAddresses({
                coinType,
                accountIndex: account.index,
            })
        )[0]
    } else {
        evmAddress = await Ledger.generateEvmAddress(account.index, coinType)
    }
    const evmAddresses = account?.evmAddresses ?? {}
    evmAddresses[coinType] = evmAddress
    updateActiveAccount(account.index, { evmAddresses })
    updateActiveAccountPersistedData(account.index, { evmAddresses })
    return evmAddress
}
