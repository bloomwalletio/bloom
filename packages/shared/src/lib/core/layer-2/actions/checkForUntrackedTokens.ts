import { IAccountState } from '@core/account/interfaces'
import { getNetwork } from '@core/network'

import { addNewTrackedTokenToActiveProfile, isTrackedTokenAddress } from '@core/wallet/actions'

export function checkForUntrackedTokens(account: IAccountState): void {
    const chains = getNetwork()?.getChains()
    chains?.forEach(async (chain) => {
        const coinType = chain.getConfiguration().coinType
        const evmAddress = account.evmAddresses[coinType]
        if (!evmAddress) {
            return
        }
        const tokens = await chain.getBalanceOfAddress(evmAddress)
        const networkId = chain.getConfiguration().id
        const untrackedTokens = tokens.filter((token) => !isTrackedTokenAddress(networkId, token.address))
        untrackedTokens.forEach((token) => {
            const { address, standard, name, symbol, decimals } = token
            addNewTrackedTokenToActiveProfile(networkId, address, { standard, name, symbol, decimals })
        })
    })
}
