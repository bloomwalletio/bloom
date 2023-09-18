import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '@core/account/stores/selected-account.store'
import { layer2Balances } from '@core/layer-2/stores/layer2-balances.store'
import { marketCoinPrices } from '@core/market/stores/market-coin-prices.store'
import { NetworkId } from '@core/network'
import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { getAccountTokensForSelectedAccount } from '../actions/getAccountTokensForSelectedAccount'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { ITokenWithBalance, TokenFilter } from '../interfaces'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getPersistedToken, persistedTokens } from './persisted-tokens.store'

export const tokenFilter: Writable<TokenFilter> = writable(DEFAULT_ASSET_FILTER)

export const selectedAccountTokens: Readable<AccountTokens> = derived(
    [activeProfileId, marketCoinPrices, selectedAccount, persistedTokens, tokenFilter, layer2Balances],
    ([$activeProfileId, $marketCoinPrices]) => {
        if ($activeProfileId) {
            return getAccountTokensForSelectedAccount($marketCoinPrices)
        } else {
            return {}
        }
    }
)

export const visibleSelectedAccountTokens: Readable<AccountTokens> = derived(
    [selectedAccountTokens],
    ([$selectedAccountTokens]) => {
        const visibleTokens: AccountTokens = {}
        for (const _networkId of Object.keys($selectedAccountTokens)) {
            const networkId = _networkId as NetworkId
            const visible: IAccountTokensPerNetwork = {
                baseCoin: $selectedAccountTokens[networkId]?.baseCoin,
                nativeTokens: $selectedAccountTokens[networkId]?.nativeTokens.filter((asset) => !asset.hidden) ?? [],
            }
            visibleTokens[networkId] = visible
        }
        return visibleTokens
    }
)

export function getTokenFromSelectedAccountTokens(
    tokenId: string,
    networkId: NetworkId
): ITokenWithBalance | undefined {
    const tokens = get(selectedAccountTokens)[networkId]
    const { baseCoin, nativeTokens } = tokens ?? {}
    if (tokenId === baseCoin?.id) {
        return baseCoin
    } else {
        const token = nativeTokens?.find((token) => token.id === tokenId)
        if (token) {
            return token
        } else {
            const persistedToken = getPersistedToken(tokenId)
            return persistedToken
                ? {
                      ...persistedToken,
                      networkId,
                      balance: {
                          total: 0,
                          available: 0,
                      },
                  }
                : undefined
        }
    }
}
