import { getSelectedAccount } from '@core/account/stores'
import { MarketCoinPrices } from '@core/market'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { ChainId, NetworkId, getNetwork } from '@core/network'
import { getCoinType } from '@core/profile'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getLayer2AccountBalance } from '@core/layer-2/stores'
import { getPersistedAsset } from '../stores'
import { sortTokens } from '@core/wallet/utils/sortAssets'
import { IToken } from '../interfaces'
import { isValidIrc30Token } from '../utils'

export function getAccountTokensForSelectedAccount(marketCoinPrices: MarketCoinPrices): AccountTokens {
    const accountAssets = {} as AccountTokens

    const networkId = getActiveNetworkId()
    if (!networkId) {
        return {}
    }

    accountAssets[networkId] = getAccountAssetForNetwork(marketCoinPrices, networkId)
    const chains = getNetwork()?.getChains() ?? []

    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId
        const chainAssets = getAccountAssetForChain(chainId)
        if (chainAssets) {
            accountAssets[chainId] = chainAssets
        }
    }

    return accountAssets
}

function getAccountAssetForNetwork(marketCoinPrices: MarketCoinPrices, networkId: NetworkId): IAccountTokensPerNetwork {
    const account = getSelectedAccount()

    const shouldCalculateFiatPrice = networkId === NetworkId.Shimmer || networkId === NetworkId.Testnet
    const persistedBaseCoin = getPersistedAsset(getCoinType())
    const baseCoin: IToken = {
        ...persistedBaseCoin,
        chainId: ChainId.Layer1,
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
        ...(shouldCalculateFiatPrice && { marketPrices: marketCoinPrices?.shimmer }),
    }

    const nativeTokens: IToken[] = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getPersistedAsset(token.tokenId)
        if (persistedAsset && persistedAsset?.metadata && isValidIrc30Token(persistedAsset.metadata)) {
            nativeTokens.push({
                ...persistedAsset,
                chainId: ChainId.Layer1,
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

function getAccountAssetForChain(chainId: number): IAccountTokensPerNetwork | undefined {
    const index = getSelectedAccount()?.index
    const balanceForChainId = index !== undefined ? getLayer2AccountBalance(index)?.[chainId] : undefined

    if (!balanceForChainId) {
        return undefined
    }

    let baseCoin: IToken | undefined
    const nativeTokens: IToken[] = []
    const tokens = Object.entries(balanceForChainId) ?? []

    for (const [tokenId, balance] of tokens) {
        const _balance = {
            total: balance,
            available: balance,
        }

        if (tokenId === '0x') {
            const persistedBaseCoin = getPersistedAsset(getCoinType()) // we use the L1 coin type for now because we assume that the basecoin for L2 is SMR
            baseCoin = {
                ...persistedBaseCoin,
                balance: _balance,
                chainId,
            }
        } else {
            const persistedAsset = getPersistedAsset(tokenId)
            if (persistedAsset && persistedAsset?.metadata && isValidToken(persistedAsset.metadata)) {
                nativeTokens.push({
                    ...persistedAsset,
                    balance: _balance,
                    chainId,
                })
            }
        }
    }

    return {
        baseCoin,
        nativeTokens: sortTokens(nativeTokens),
    }
}
