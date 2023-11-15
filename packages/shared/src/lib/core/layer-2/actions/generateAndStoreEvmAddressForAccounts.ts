import { IAccountState } from '@core/account/interfaces'
import { Ledger } from '@core/ledger/classes'
import { ProfileType } from '@core/profile/enums'
import { api, getProfileManager } from '@core/profile-manager'
import { updateActiveAccountPersistedData } from '@core/profile/actions'
import { updateActiveAccount } from '@core/profile/stores'

export async function generateAndStoreEvmAddressForAccounts(
    profileType: ProfileType,
    coinType: number,
    ...accounts: IAccountState[]
): Promise<void> {
    for (const account of accounts ?? []) {
        if (account.evmAddresses?.[coinType]) {
            continue
        }

        const accountIndex = account.index

        let evmAddress: string | undefined
        if (profileType === ProfileType.Software) {
            const manager = await api.getSecretManager(getProfileManager().id)
            // Follow MetaMask's convention around incrementing address indices instead of account indices
            const addresses = await manager.generateEvmAddresses({
                coinType,
                accountIndex: 0,
                range: {
                    start: accountIndex,
                    end: accountIndex + 1,
                },
                options: {
                    internal: false,
                },
            })
            evmAddress = addresses?.[0]
        } else {
            evmAddress = await Ledger.generateEvmAddress(accountIndex, coinType)
            evmAddress = evmAddress.toLowerCase()
        }

        const evmAddresses = { [coinType]: evmAddress }
        updateActiveAccount(accountIndex, { evmAddresses })
        updateActiveAccountPersistedData(accountIndex, { evmAddresses })
    }
}
