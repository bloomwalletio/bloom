import { IAccountState } from '@core/account/interfaces'
import { ContractType, fetchIscAssetsForAccount } from '@core/layer-2'
import { IEvmNetwork } from '@core/network/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { updateErc721NftsOwnership } from '@core/nfts/actions'
import { getActiveProfile } from '@core/profile/stores'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { Converter } from '@core/utils/convert'
import { ITokenBalance, TokenTrackingStatus } from '@core/token'
import features from '@features/features'
import { IError } from '@core/error'
import { isIscChain } from '@core/network/utils/isIscChain'
import { setLayer2AccountBalanceForChain } from '@core/layer-2/stores'

export function fetchL2BalanceForAccount(profileId: string, account: IAccountState): void {
    const { evmAddresses, index } = account
    const evmNetworks = getEvmNetworks()
    evmNetworks.forEach(async (evmNetwork) => {
        const { coinType, id: networkId } = evmNetwork
        const evmAddress = evmAddresses?.[coinType]
        if (!evmAddress) {
            return
        }

        if (features.collectibles.erc721.enabled) {
            void updateErc721NftsOwnership(account, evmNetwork.id)
        }

        try {
            const l2TokenBalance = isIscChain(evmNetwork)
                ? await fetchIscAssetsForAccount(profileId, evmAddress, evmNetwork, account)
                : {}

            const erc20Balances = await getErc20BalancesForAddress(evmAddress, evmNetwork)
            for (const [tokenId, balance] of Object.entries(erc20Balances)) {
                await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
                l2TokenBalance[tokenId] = Number.isNaN(Number(balance)) ? BigInt(0) : balance
            }
            setLayer2AccountBalanceForChain(index, networkId, l2TokenBalance)
        } catch (error) {
            console.error(error)
        }
    })
}

async function getErc20BalancesForAddress(evmAddress: string, evmNetwork: IEvmNetwork): Promise<ITokenBalance> {
    const networkId = evmNetwork.id
    const coinType = evmNetwork.coinType

    const trackedTokens = getActiveProfile()?.trackedTokens?.[networkId] ?? {}
    const erc20TokenBalances: ITokenBalance = {}
    for (const [erc20Address, trackingStatus] of Object.entries(trackedTokens)) {
        try {
            if (trackingStatus === TokenTrackingStatus.Untracked) {
                continue
            }

            const contract = evmNetwork?.getContract(ContractType.Erc20, erc20Address)
            if (!contract || !coinType) {
                continue
            }
            const rawBalance = await contract.methods.balanceOf(evmAddress).call()
            erc20TokenBalances[erc20Address] = Converter.bigIntLikeToBigInt(rawBalance)
        } catch (err) {
            const error = (err as IError)?.message ?? err
            console.error(error)
        }
    }
    return erc20TokenBalances
}
