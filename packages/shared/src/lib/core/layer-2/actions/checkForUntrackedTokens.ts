import { IAccountState } from '@core/account/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { TokenStandard, TokenTrackingStatus } from '@core/token'
import { addNewTrackedTokenToActiveProfile, hasTokenBeenUntracked } from '@core/wallet/actions'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '../constants'
import { BlockscoutApi } from '@auxiliary/blockscout/api'

export function checkForUntrackedTokens(account: IAccountState, addPreviouslyUntracked?: boolean): void {
    const evmNetworks = getEvmNetworks()
    evmNetworks?.forEach(async (evmNetwork) => {
        const evmAddress = account.evmAddresses[evmNetwork.coinType]
        if (!evmAddress || !evmNetwork.explorerUrl) {
            return
        }
        const networkId = evmNetwork.id
        const blockscoutApi = new BlockscoutApi(networkId)

        const tokens = await blockscoutApi.getAssetsForAddress(evmAddress)
        const untrackedTokensToTrack = tokens.filter(
            ({ token }) => addPreviouslyUntracked || !hasTokenBeenUntracked(token.address.toLowerCase(), networkId)
        )
        untrackedTokensToTrack.forEach(({ token }) => {
            const { address, type, name, symbol, decimals } = token
            if (address !== BASE_TOKEN_CONTRACT_ADDRESS?.[networkId]) {
                addNewTrackedTokenToActiveProfile(
                    networkId,
                    address.toLowerCase(),
                    { standard: type as TokenStandard.Erc20, name, symbol, decimals },
                    TokenTrackingStatus.AutomaticallyTracked
                )
            }
        })
    })
}
