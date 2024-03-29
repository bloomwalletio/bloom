import { showNotification } from '@auxiliary/notification/actions'
import { registerProposalsFromNodes } from '@contexts/governance/actions'
import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { createNewAccount } from './createNewAccount'
import { setSelectedAccount } from './setSelectedAccount'
import { getActiveProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile'
import { generateAndStoreEvmAddressForAccounts, pollL2BalanceForAccount } from '@core/layer-2/actions'
import { getNetwork } from '@core/network/stores'
import { IError } from '@core/error/interfaces'

export async function tryCreateAdditionalAccount(alias: string, color: string): Promise<void> {
    try {
        const account = await createNewAccount(alias, color)
        setSelectedAccount(account?.index)

        if (Platform.isFeatureFlagEnabled('governance')) {
            void registerProposalsFromNodes([account])
        }

        const activeProfile = getActiveProfile()
        if (activeProfile.type === ProfileType.Software) {
            const coinType = getNetwork()?.getChains()[0]?.getConfiguration()?.coinType
            if (coinType) {
                void generateAndStoreEvmAddressForAccounts(activeProfile.type, coinType, account)
                void pollL2BalanceForAccount(activeProfile.id, account)
            }
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
