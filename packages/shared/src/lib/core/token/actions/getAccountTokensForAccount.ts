import { IAccountState } from '@core/account/interfaces'
import { getLayer2AccountBalance } from '@core/layer-2/stores'
import { MarketCoinPrices, MarketCurrency, MarketPrices } from '@core/market'
import { shimmerEvmAddressToCoinGeckoIdMap } from '@core/market/stores'
import { calculateFiatValueFromTokenAmountAndMarketPrice } from '@core/market/utils'
import { EvmNetworkId, NetworkId, StardustNetworkId, getEvmNetworks } from '@core/network'
import { getActiveNetworkId } from '@core/network/actions/getActiveNetworkId'
import { get } from 'svelte/store'
import { BASE_TOKEN_ID } from '../constants'
import { IPersistedToken, ITokenWithBalance } from '../interfaces'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getPersistedToken } from '../stores'
import { isValidIrc30Token, isValidToken } from '../utils'
import { ISC_BASE_COIN_ADDRESS } from '@core/layer-2'

export function getAccountTokensForAccount(
    account: IAccountState,
    marketCoinPrices: MarketCoinPrices,
    marketCurrency: MarketCurrency
): AccountTokens {
    try {
        const accountAssets = {} as AccountTokens
        const networkId = getActiveNetworkId()

        accountAssets[networkId] = getAccountAssetForNetwork(account, marketCoinPrices, marketCurrency, networkId)
        const evmNetworkIds = getEvmNetworks()

        for (const evmNetwork of evmNetworkIds) {
            const chainAssets = getAccountAssetForChain(account, marketCoinPrices, marketCurrency, evmNetwork.id)
            if (chainAssets) {
                accountAssets[evmNetwork.id] = chainAssets
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
    networkId: StardustNetworkId
): IAccountTokensPerNetwork {
    const persistedBaseCoin = getPersistedToken(networkId, BASE_TOKEN_ID)
    const baseCoinMarketPrices = marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? '']
    const baseCoinMarketPrice = String(baseCoinMarketPrices?.[marketCurrency])
    const baseCoinTotal = account?.balances?.baseCoin?.total
    const baseCoinAvailable = account?.balances?.baseCoin?.available

    const baseCoin = createTokenWithBalanceFromPersistedAsset(
        persistedBaseCoin,
        baseCoinTotal,
        baseCoinMarketPrices,
        marketCurrency,
        networkId
    )
    baseCoin.balance.available = baseCoinAvailable
    baseCoin.balance.availableFiat = calculateFiatValueFromTokenAmountAndMarketPrice(
        baseCoinAvailable,
        persistedBaseCoin.metadata?.decimals,
        baseCoinMarketPrice
    )

    const nativeTokens: ITokenWithBalance[] = []
    const tokens = account?.balances?.nativeTokens ?? []
    for (const token of tokens) {
        const persistedAsset = getPersistedToken(networkId, token.tokenId)
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
        nativeTokens,
    }
}

function getAccountAssetForChain(
    account: IAccountState,
    marketCoinPrices: MarketCoinPrices,
    marketCurrency: MarketCurrency,
    networkId: EvmNetworkId
): IAccountTokensPerNetwork | undefined {
    const persistedBaseCoin = getPersistedToken(networkId, BASE_TOKEN_ID)
    const baseCoinMarketPrices = marketCoinPrices?.[persistedBaseCoin.metadata?.name?.toLowerCase() ?? '']
    let baseCoin = createTokenWithBalanceFromPersistedAsset(
        persistedBaseCoin,
        BigInt(0),
        baseCoinMarketPrices,
        marketCurrency,
        networkId
    )
    const nativeTokens: ITokenWithBalance[] = []

    const balanceForNetworkId = getLayer2AccountBalance(account.index)?.[networkId]
    const tokens = Object.entries(balanceForNetworkId ?? {}) ?? []

    for (const [tokenId, balance] of tokens) {
        if (tokenId === ISC_BASE_COIN_ADDRESS) {
            // ignore erc20 interface of the base coin of the evmNetwork
            continue
        } else if (tokenId === BASE_TOKEN_ID) {
            baseCoin = createTokenWithBalanceFromPersistedAsset(
                persistedBaseCoin,
                balance,
                baseCoinMarketPrices,
                marketCurrency,
                networkId
            )
        } else {
            const persistedAsset = getPersistedToken(networkId, tokenId)
            if (balance && persistedAsset && persistedAsset?.metadata && isValidToken(persistedAsset.metadata)) {
                const assetMarketPrices = marketCoinPrices?.[get(shimmerEvmAddressToCoinGeckoIdMap)?.[tokenId]]
                const nativeToken = createTokenWithBalanceFromPersistedAsset(
                    persistedAsset,
                    balance,
                    assetMarketPrices,
                    marketCurrency,
                    networkId
                )
                nativeTokens.push(nativeToken)
            }
        }
    }

    return {
        baseCoin,
        nativeTokens,
    }
}

function createTokenWithBalanceFromPersistedAsset(
    persistedToken: IPersistedToken,
    balance: bigint,
    marketPrices: MarketPrices | undefined,
    marketCurrency: MarketCurrency,
    networkId: NetworkId
): ITokenWithBalance {
    const marketPrice = String(marketPrices?.[marketCurrency])
    const decimals = persistedToken.metadata?.decimals

    return {
        ...persistedToken,
        balance: {
            total: balance,
            totalFiat: calculateFiatValueFromTokenAmountAndMarketPrice(balance, decimals, marketPrice),
            available: balance,
            availableFiat: calculateFiatValueFromTokenAmountAndMarketPrice(balance, decimals, marketPrice),
        },
        networkId,
        marketPrices,
    }
}
