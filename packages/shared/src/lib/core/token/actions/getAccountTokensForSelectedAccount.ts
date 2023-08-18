import { getSelectedAccount } from '@core/account/stores'
import { MarketCoinPrices } from '@core/market'
import { getNamespaceFromNetworkId } from '@core/network/utils'
import { getNetwork, NetworkId, NetworkNamespace } from '@core/network'
import { getCoinType } from '@core/profile/actions'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getLayer2AccountBalance } from '@core/layer-2/stores'
import { getPersistedToken } from '../stores'
import { sortTokens } from '@core/token/utils/sortTokens'
import { IToken } from '../interfaces'
import { isValidIrc30Token, isValidToken } from '../utils'
import { getActiveNetworkId } from '@core/network/utils/getActiveNetworkId'

export function getAccountTokensForSelectedAccount(marketCoinPrices: MarketCoinPrices): AccountTokens {
    const accountAssets = {} as AccountTokens

    const networkId = getActiveNetworkId()
    if (!networkId) {
        return {}
    }

    accountAssets[networkId] = getAccountAssetForNetwork(marketCoinPrices, networkId)
    const chains = getNetwork()?.getChains() ?? []

    for (const chain of chains) {
        const id = chain.getConfiguration().id
        const chainAssets = getAccountAssetForChain(id)
        if (chainAssets) {
            accountAssets[id] = chainAssets
        }
    }

    return accountAssets
}

function getAccountAssetForNetwork(marketCoinPrices: MarketCoinPrices, networkId: NetworkId): IAccountTokensPerNetwork {
    const account = getSelectedAccount()

    // TODO: Write isStardustNetworkName function that uses this logic? Or generic isNetworkIdOfNetworkNamespace
    const shouldCalculateFiatPrice = getNamespaceFromNetworkId(networkId) === NetworkNamespace.Stardust
    const persistedBaseCoin = getPersistedToken(getCoinType())
    const baseCoin: IToken = {
        ...persistedBaseCoin,
        networkId,
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
        ...(shouldCalculateFiatPrice && { marketPrices: marketCoinPrices?.shimmer }),
    }

    const nativeTokens: IToken[] = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getPersistedToken(token.tokenId)
        if (persistedAsset && persistedAsset?.metadata && isValidIrc30Token(persistedAsset.metadata)) {
            nativeTokens.push({
                ...persistedAsset,
                networkId,
                balance: {
                    total: Number(token.total),
                    available: Number(token.available),
                },
            })
        }
    }

    return {
        baseCoin,
        nativeTokens: sortTokens(nativeTokens),
    }
}

function getAccountAssetForChain(networkId: NetworkId): IAccountTokensPerNetwork | undefined {
    const index = getSelectedAccount()?.index
    const balanceForNetworkId = index !== undefined ? getLayer2AccountBalance(index)?.[networkId] : undefined

    if (!balanceForNetworkId) {
        return undefined
    }

    let baseCoin: IToken | undefined
    const nativeTokens: IToken[] = []
    const tokens = Object.entries(balanceForNetworkId) ?? []

    for (const [tokenId, balance] of tokens) {
        const _balance = {
            total: balance,
            available: balance,
        }

        if (tokenId === '0x') {
            const persistedBaseCoin = getPersistedToken(getCoinType()) // we use the L1 coin type for now because we assume that the basecoin for L2 is SMR
            baseCoin = {
                ...persistedBaseCoin,
                balance: _balance,
                networkId,
            }
        } else {
            const persistedAsset = getPersistedToken(tokenId)
            if (persistedAsset && persistedAsset?.metadata && isValidToken(persistedAsset.metadata)) {
                nativeTokens.push({
                    ...persistedAsset,
                    balance: _balance,
                    networkId,
                })
            }
        }
    }

    return {
        baseCoin,
        nativeTokens: sortTokens(nativeTokens),
    }
}
