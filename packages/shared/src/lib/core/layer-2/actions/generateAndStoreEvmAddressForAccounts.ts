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

        const accountIndex = account.getMetadata().index

        let evmAddress: string | undefined
        if (profileType === ProfileType.Software) {
            const manager = await api.getSecretManager(getProfileManager().id)
            evmAddress = (
                await manager.generateEvmAddresses({
                    coinType,
                    accountIndex,
                    options: {
                        internal: false,
                    },
                })
            )?.[0]
        } else {
            evmAddress = await Ledger.generateEvmAddress(accountIndex, coinType)
        }

        const evmAddresses = { [coinType]: evmAddress }
        updateActiveAccount(accountIndex, { evmAddresses })
        updateActiveAccountPersistedData(accountIndex, { evmAddresses })
    }
}
