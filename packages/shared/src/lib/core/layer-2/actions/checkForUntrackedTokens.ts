import { IAccountState } from '@core/account/interfaces'
import { EvmNetworkId } from '@core/network'
import { getNetwork } from '@core/network/stores'
import { TokenStandard, TokenTrackingStatus } from '@core/token'
import { addNewTrackedTokenToActiveProfile, hasTokenBeenUntracked } from '@core/wallet/actions'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '../constants'
import { BlockscoutApi } from '@auxiliary/blockscout/api'

export function checkForUntrackedTokens(account: IAccountState, addPreviouslyUntracked?: boolean): void {
    const chains = getNetwork()?.getChains()
    chains?.forEach(async (chain) => {
        const evmAddress = account.evmAddresses[chain.coinType]
        if (!evmAddress) {
            return
        }
        const networkId = chain.id
        const blockscoutApi = new BlockscoutApi(networkId)

        const tokens = await blockscoutApi.getAssetsForAddress(evmAddress)
        const untrackedTokensToTrack = tokens.filter(
            ({ token }) => addPreviouslyUntracked || !hasTokenBeenUntracked(token.address.toLowerCase(), networkId)
        )
        untrackedTokensToTrack.forEach(({ token }) => {
            const { address, type, name, symbol, decimals } = token
            if (address !== BASE_TOKEN_CONTRACT_ADDRESS?.[networkId as EvmNetworkId]) {
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
