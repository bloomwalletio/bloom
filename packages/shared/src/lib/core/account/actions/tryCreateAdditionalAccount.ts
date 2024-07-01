import { showNotification } from '@auxiliary/notification/actions'
import { registerProposalsFromNodes } from '@contexts/governance/actions'
import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { createNewAccount } from './createNewAccount'
import { setSelectedAccount } from './setSelectedAccount'
import { getActiveProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile'
import { generateAndStoreEvmAddressForAccounts, pollEvmBalancesForAccount } from '@core/layer-2/actions'
import { IError } from '@core/error/interfaces'
import { DEFAULT_COIN_TYPE, SupportedNetworkId } from '@core/network/constants'
import { addAccountToAllDappSessions, updateAccountForConnectedDapps } from '@auxiliary/wallet-connect/actions'

export async function tryCreateAdditionalAccount(alias: string, color: string): Promise<void> {
    try {
        const account = await createNewAccount(alias, color)
        setSelectedAccount(account?.index)

        if (Platform.isFeatureFlagEnabled('governance')) {
            void registerProposalsFromNodes([account])
        }

        const activeProfile = getActiveProfile()
        if (activeProfile.type === ProfileType.Software) {
            const coinType = DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum]
            generateAndStoreEvmAddressForAccounts(activeProfile.type, coinType, account).then(async () => {
                void pollEvmBalancesForAccount(activeProfile.id, account)
                await addAccountToAllDappSessions(account)
                await updateAccountForConnectedDapps(account)
            })
        }

        return Promise.resolve()
    } catch (err) {
        const errorMessage = (err as IError)?.error ?? (err as string)
        if (errorMessage) {
            console.error(errorMessage)
            showNotification({
                variant: 'error',
                text: localize(errorMessage) ?? errorMessage,
            })
        }
        return Promise.reject({ error: errorMessage })
    }
}
