import { IAccountState } from '@core/account/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { TokenStandard, TokenTrackingStatus } from '@core/token'
import { addNewTrackedTokenToActiveProfile, hasTokenBeenUntracked } from '@core/wallet/actions'
import { ISC_BASE_COIN_ADDRESS } from '../constants'
import { BlockscoutApi } from '@auxiliary/blockscout/api'

export async function checkForUntrackedTokens(account: IAccountState, addPreviouslyUntracked?: boolean): Promise<void> {
    const evmNetworks = getEvmNetworks()
    for (const evmNetwork of evmNetworks) {
        const evmAddress = account.evmAddresses[evmNetwork.coinType]
        if (!evmAddress || !evmNetwork?.blockscoutIndexerUrl) {
            return
        }
        const networkId = evmNetwork.id
        const blockscoutApi = new BlockscoutApi(evmNetwork.blockscoutIndexerUrl)

        const tokens = await blockscoutApi.getAssetsForAddress(evmAddress)
        const untrackedTokensToTrack = tokens.filter(
            ({ token }) => addPreviouslyUntracked || !hasTokenBeenUntracked(token.address.toLowerCase(), networkId)
        )
        untrackedTokensToTrack.forEach(({ token }) => {
            const { address, type, name, symbol, decimals } = token
            if (address !== ISC_BASE_COIN_ADDRESS) {
                addNewTrackedTokenToActiveProfile(
                    networkId,
                    address.toLowerCase(),
                    { standard: type as TokenStandard.Erc20, name, symbol, decimals },
                    TokenTrackingStatus.AutomaticallyTracked
                )
            }
        })
    }
}
