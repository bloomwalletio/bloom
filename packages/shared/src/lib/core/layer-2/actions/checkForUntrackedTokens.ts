import { IAccountState } from '@core/account/interfaces'
import { getNetwork } from '@core/network/stores'
import { addNewTrackedTokenToActiveProfile, hasTokenBeenUntracked, isTrackedTokenAddress } from '@core/wallet/actions'

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
        const untrackedTokensToTrack = tokens.filter(
            (token) =>
                !isTrackedTokenAddress(networkId, token.address) && !hasTokenBeenUntracked(token.address, networkId)
        )
        untrackedTokensToTrack.forEach((token) => {
            const { address, standard, name, symbol, decimals } = token
            addNewTrackedTokenToActiveProfile(networkId, address, { standard, name, symbol, decimals })
        })
    })
}
