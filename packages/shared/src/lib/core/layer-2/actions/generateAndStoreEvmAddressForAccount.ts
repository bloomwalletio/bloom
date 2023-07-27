import { get } from 'svelte/store'
import { IAccountState } from '@core/account/interfaces'
import { ProfileType, updateActiveAccount, updateActiveAccountPersistedData } from '@core/profile'
import { ledger } from '@core/ledger/stores'

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
        evmAddress = await get(ledger).generateEvmAddress(account.index, coinType)
        console.log('evm address: ', evmAddress)
    }
    const evmAddresses = account?.evmAddresses ?? {}
    evmAddresses[coinType] = evmAddress
    updateActiveAccount(account.index, { evmAddresses })
    updateActiveAccountPersistedData(account.index, { evmAddresses })
    return evmAddress
}
