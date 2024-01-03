import { IAccountState } from '@core/account/interfaces'
import { getLayer2AccountBalance } from '@core/layer-2/stores'
import { MarketCoinPrices, MarketCurrency } from '@core/market'
import { shimmerEvmAddressToCoinGeckoIdMap } from '@core/market/stores'
import { calculateFiatValueFromTokenValueAndMarketPrice } from '@core/market/utils'
import { NetworkId, EvmNetworkId, getNetwork } from '@core/network'
import { getActiveNetworkId } from '@core/network/actions/getActiveNetworkId'
import { sortTokens } from '@core/token/utils/sortTokens'
import { get } from 'svelte/store'
import { BASE_TOKEN_ID } from '../constants'
import { ITokenWithBalance } from '../interfaces'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getPersistedToken } from '../stores'
import { isValidIrc30Token, isValidToken } from '../utils'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '@core/layer-2'

export function getAccountTokensForAccount(
    account: IAccountState,
    marketCoinPrices: MarketCoinPrices,
    marketCurrency: MarketCurrency
): AccountTokens {
    try {
        const accountAssets = {} as AccountTokens
        const networkId = getActiveNetworkId()

        accountAssets[networkId] = getAccountAssetForNetwork(account, marketCoinPrices, marketCurrency, networkId)
        const chains = getNetwork()?.getChains() ?? []

        for (const chain of chains) {
            const id = chain.getConfiguration().id
            const chainAssets = getAccountAssetForChain(account, marketCoinPrices, marketCurrency, id)
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
    marketCurrency: MarketCurrency,
    networkId: NetworkId
): IAccountTokensPerNetwork {
    const persistedBaseCoin = getPersistedToken(BASE_TOKEN_ID)
    const baseCoinMarketPrices = marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? '']
    const baseCoinMarketPrice = baseCoinMarketPrices?.[marketCurrency]
    const baseCoinTotal = account?.balances?.baseCoin?.total
    const baseCoinAvailable = account?.balances?.baseCoin?.available

    const baseCoin: ITokenWithBalance = {
        ...persistedBaseCoin,
        networkId,
        balance: {
            total: baseCoinTotal,
            totalFiat: calculateFiatValueFromTokenValueAndMarketPrice(
                baseCoinTotal,
                persistedBaseCoin.metadata?.decimals,
                baseCoinMarketPrice
            ),
            available: baseCoinAvailable,
            availableFiat: calculateFiatValueFromTokenValueAndMarketPrice(
                baseCoinAvailable,
                persistedBaseCoin.metadata?.decimals,
                baseCoinMarketPrice
            ),
        },
        marketPrices: baseCoinMarketPrices,
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
                    total: token.total,
                    available: token.available,
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
    account: IAccountState,
    marketCoinPrices: MarketCoinPrices,
    marketCurrency: MarketCurrency,
    networkId: NetworkId
): IAccountTokensPerNetwork | undefined {
    const balanceForNetworkId = getLayer2AccountBalance(account.index)?.[networkId]

    if (!balanceForNetworkId) {
        return undefined
    }

    let baseCoin: ITokenWithBalance | undefined
    const nativeTokens: ITokenWithBalance[] = []
    const tokens = Object.entries(balanceForNetworkId) ?? []

    for (const [tokenId, balance] of tokens) {
        if (tokenId === BASE_TOKEN_CONTRACT_ADDRESS?.[networkId as EvmNetworkId]) {
            // ignore erc20 interface of the base coin of the chain
            continue
        } else if (tokenId === BASE_TOKEN_ID) {
            const persistedBaseCoin = getPersistedToken(BASE_TOKEN_ID) // we use the L1 coin type for now because we assume that the basecoin for L2 is SMR
            const baseCoinMarketPrices = marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? '']
            const baseCoinMarketPrice = baseCoinMarketPrices?.[marketCurrency]

            baseCoin = {
                ...persistedBaseCoin,
                balance: {
                    total: balance,
                    totalFiat: calculateFiatValueFromTokenValueAndMarketPrice(
                        balance,
                        persistedBaseCoin.metadata?.decimals,
                        baseCoinMarketPrice
                    ),
                    available: balance,
                    availableFiat: calculateFiatValueFromTokenValueAndMarketPrice(
                        balance,
                        persistedBaseCoin.metadata?.decimals,
                        baseCoinMarketPrice
                    ),
                },
                networkId,
                marketPrices: marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? ''],
            }
        } else {
            const persistedAsset = getPersistedToken(tokenId)
            const assetMarketPrices = marketCoinPrices?.[get(shimmerEvmAddressToCoinGeckoIdMap)?.[tokenId]]
            const assetMarketPrice = assetMarketPrices?.[marketCurrency]

            if (persistedAsset && persistedAsset?.metadata && isValidToken(persistedAsset.metadata)) {
                nativeTokens.push({
                    ...persistedAsset,
                    balance: {
                        total: balance,
                        totalFiat: calculateFiatValueFromTokenValueAndMarketPrice(
                            balance,
                            persistedAsset.metadata?.decimals,
                            assetMarketPrice
                        ),
                        available: balance,
                        availableFiat: calculateFiatValueFromTokenValueAndMarketPrice(
                            balance,
                            persistedAsset.metadata?.decimals,
                            assetMarketPrice
                        ),
                    },
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
