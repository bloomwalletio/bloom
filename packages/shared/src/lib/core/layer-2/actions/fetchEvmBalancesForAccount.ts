import { IAccountState } from '@core/account/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { ITokenBalance } from '@core/token'
import { setLayer2AccountBalanceForChain } from '@core/layer-2/stores'
import { activeProfileId } from '@core/profile/stores'
import { get } from 'svelte/store'

export function fetchEvmBalancesForAccount(profileId: string, account: IAccountState): void {
    const evmNetworks = getEvmNetworks()
    evmNetworks.forEach(async (evmNetwork) => {
        try {
            const tokenBalance: ITokenBalance = (await evmNetwork.getBalance(account)) ?? {}

            if (get(activeProfileId) === profileId) {
                setLayer2AccountBalanceForChain(account.index, evmNetwork.id, tokenBalance)
            }
        } catch (error) {
            console.error(error)
        }
    })
}
