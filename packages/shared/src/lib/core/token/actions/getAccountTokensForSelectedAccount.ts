import { IAccountState } from '@core/account/interfaces'
import { getSelectedAccount } from '@core/account/stores'
import { getLayer2AccountBalance } from '@core/layer-2/stores'
import { MarketCoinPrices } from '@core/market'
import { getNetwork, NetworkId } from '@core/network'
import { getActiveNetworkId } from '@core/network/actions/getActiveNetworkId'
import { sortTokens } from '@core/token/utils/sortTokens'
import { BASE_TOKEN_ID } from '../constants'
import { ITokenWithBalance } from '../interfaces'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getPersistedToken } from '../stores'
import { isValidIrc30Token, isValidToken } from '../utils'
import { shimmerEvmAddressToCoinGeckoIdMap } from '@core/market/stores'
import { get } from 'svelte/store'

export function getAccountTokensForSelectedAccount(marketCoinPrices: MarketCoinPrices): AccountTokens {
    try {
        const accountAssets = {} as AccountTokens
        const account = getSelectedAccount()
        const networkId = getActiveNetworkId()

        accountAssets[networkId] = getAccountAssetForNetwork(account, marketCoinPrices, networkId)
        const chains = getNetwork()?.getChains() ?? []

        for (const chain of chains) {
            const id = chain.getConfiguration().id
            const chainAssets = getAccountAssetForChain(account.index, marketCoinPrices, id)
            if (chainAssets) {
                accountAssets[id] = chainAssets
            }
        }

        return accountAssets
    } catch (_) {
        return {}
    }
}

function getAccountAssetForNetwork(
    account: IAccountState,
    marketCoinPrices: MarketCoinPrices,
    networkId: NetworkId
): IAccountTokensPerNetwork {
    const persistedBaseCoin = getPersistedToken(BASE_TOKEN_ID)
    const baseCoin: ITokenWithBalance = {
        ...persistedBaseCoin,
        networkId,
        balance: {
            total: Number(account?.balances?.baseCoin?.total),
            available: Number(account?.balances?.baseCoin?.available),
        },
        marketPrices: marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? ''],
    }

    const nativeTokens: ITokenWithBalance[] = []
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

function getAccountAssetForChain(
    accountIndex: number,
    marketCoinPrices: MarketCoinPrices,
    networkId: NetworkId
): IAccountTokensPerNetwork | undefined {
    const balanceForNetworkId = getLayer2AccountBalance(accountIndex)?.[networkId]

    if (!balanceForNetworkId) {
        return undefined
    }

    let baseCoin: ITokenWithBalance | undefined
    const nativeTokens: ITokenWithBalance[] = []
    const tokens = Object.entries(balanceForNetworkId) ?? []

    for (const [tokenId, balance] of tokens) {
        const _balance = {
            total: balance,
            available: balance,
        }

        if (tokenId === BASE_TOKEN_ID) {
            const persistedBaseCoin = getPersistedToken(BASE_TOKEN_ID) // we use the L1 coin type for now because we assume that the basecoin for L2 is SMR
            baseCoin = {
                ...persistedBaseCoin,
                balance: _balance,
                networkId,
                marketPrices: marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? ''],
            }
        } else {
            const persistedAsset = getPersistedToken(tokenId)
            if (persistedAsset && persistedAsset?.metadata && isValidToken(persistedAsset.metadata)) {
                nativeTokens.push({
                    ...persistedAsset,
                    balance: _balance,
                    networkId,
                    marketPrices: marketCoinPrices?.[get(shimmerEvmAddressToCoinGeckoIdMap)?.[persistedAsset.id]],
                })
            }
        }
    }

    return {
        baseCoin,
        nativeTokens: sortTokens(nativeTokens),
    }
}
