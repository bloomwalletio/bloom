import { IAccountState } from '@core/account/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { ITokenBalance } from '@core/token'
import { setLayer2AccountBalanceForChain } from '@core/layer-2/stores'

export function fetchEvmBalancesForAccount(account: IAccountState): void {
    const evmNetworks = getEvmNetworks()
    evmNetworks.forEach(async (evmNetwork) => {
        try {
            const tokenBalance: ITokenBalance = (await evmNetwork.getBalance(account)) ?? {}

            setLayer2AccountBalanceForChain(account.index, evmNetwork.id, tokenBalance)
        } catch (error) {
            console.error(error)
        }
    })
}
