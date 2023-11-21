import { IChain } from '@core/network/interfaces'
import { addNewTrackedTokenToActiveProfile, isTrackedTokenAddress } from '@core/wallet/actions'

export async function checkForUntrackedTokens(evmAddress: string, chain: IChain): Promise<void> {
    const tokens = await chain.getBalanceOfAddress(evmAddress, { withMetadata: true })
    const networkId = chain.getConfiguration().id
    const untrackedTokens = tokens.filter((token) => !isTrackedTokenAddress(networkId, token.address))
    untrackedTokens.forEach((token) => {
        const { address, standard, name, symbol, decimals } = token
        addNewTrackedTokenToActiveProfile(networkId, address, { standard, name, symbol, decimals })
    })
}
