import { IAccountState } from '@core/account/interfaces'
import { getNetwork } from '@core/network/stores'
import { TokenTrackingStatus } from '@core/token'
import { addNewTrackedTokenToActiveProfile, hasTokenBeenUntracked } from '@core/wallet/actions'

export function checkForUntrackedTokens(account: IAccountState, addPreviouslyUntracked?: boolean): void {
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
            (token) => addPreviouslyUntracked || !hasTokenBeenUntracked(token.address.toLowerCase(), networkId)
        )
        untrackedTokensToTrack.forEach((token) => {
            const { address, standard, name, symbol, decimals } = token
            addNewTrackedTokenToActiveProfile(
                networkId,
                address.toLowerCase(),
                { standard, name, symbol, decimals },
                TokenTrackingStatus.AutomaticallyTracked
            )
        })
    })
}
