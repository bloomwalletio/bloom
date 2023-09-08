import { IAccountState } from '@core/account/interfaces'
import { Ledger } from '@core/ledger/classes'
import { ProfileType } from '@core/profile'
import { api, getProfileManager } from '@core/profile-manager'
import { updateActiveAccountPersistedData } from '@core/profile/actions'
import { updateActiveAccount } from '@core/profile/stores'

export async function generateAndStoreEvmAddressForAccount(
    profileType: ProfileType,
    account: IAccountState,
    coinType: number
): Promise<string | undefined> {
    let evmAddress: string | undefined
    if (profileType === ProfileType.Software) {
        const manager = await api.getSecretManager(getProfileManager().id)
        evmAddress = (
            await manager.generateEvmAddresses({
                coinType,
                accountIndex: account.index,
                options: {
                    internal: false,
                },
            })
        )?.[0]
    } else {
        evmAddress = await Ledger.generateEvmAddress(account.index, coinType)
    }
    const evmAddresses = account?.evmAddresses ?? {}
    evmAddresses[coinType] = evmAddress
    updateActiveAccount(account.index, { evmAddresses })
    updateActiveAccountPersistedData(account.index, { evmAddresses })
    return evmAddress
}
