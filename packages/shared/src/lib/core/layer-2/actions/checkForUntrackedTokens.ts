import { IAccountState } from '@core/account/interfaces'
import { EvmExplorerApi, SupportedNetworkId } from '@core/network'
import { getNetwork } from '@core/network/stores'
import { TokenStandard, TokenTrackingStatus } from '@core/token'
import { addNewTrackedTokenToActiveProfile, hasTokenBeenUntracked } from '@core/wallet/actions'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '../constants'

export function checkForUntrackedTokens(account: IAccountState, addPreviouslyUntracked?: boolean): void {
    const chains = getNetwork()?.getChains()
    chains?.forEach(async (chain) => {
        const coinType = chain.getConfiguration().coinType
        const evmAddress = account.evmAddresses[coinType]
        if (!evmAddress) {
            return
        }
        const networkId = chain.getConfiguration().id
        const explorerApi = new EvmExplorerApi(networkId)

        const tokens = await explorerApi.getAssetsForAddress(evmAddress)
        const untrackedTokensToTrack = tokens.filter(
            ({ token }) => addPreviouslyUntracked || !hasTokenBeenUntracked(token.address.toLowerCase(), networkId)
        )
        untrackedTokensToTrack.forEach(({ token }) => {
            const { address, type, name, symbol, decimals } = token
            if (address !== BASE_TOKEN_CONTRACT_ADDRESS[networkId as SupportedNetworkId]) {
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
