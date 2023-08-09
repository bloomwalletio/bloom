import { selectedAccount } from '@core/account/stores/selected-account.store'
import { layer2Balances } from '@core/layer-2/stores/layer2-balances.store'
import { marketCoinPrices } from '@core/market/stores/market-coin-prices.store'
import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { getAccountTokensForSelectedAccount } from '../actions/getAccountTokensForSelectedAccount'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { IToken, TokenFilter } from '../interfaces'
import { persistedTokens } from './persisted-tokens.store'
import { AccountTokens } from '../interfaces/account-tokens.interface'

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
        for (const networkId of Object.keys($selectedAccountTokens)) {
            const visible = {
                baseCoin: $selectedAccountTokens[networkId].baseCoin,
                nativeTokens: $selectedAccountTokens[networkId].nativeTokens.filter((asset) => !asset.hidden),
            }
            visibleTokens[networkId] = visible
        }
        return visibleTokens
    }
)

export function getTokenFromSelectedAccountTokens(assetId: string, networkId: string | number): IToken | undefined {
    const assets = get(selectedAccountTokens)[networkId]
    const { baseCoin, nativeTokens } = assets ?? {}
    if (assetId === baseCoin?.id) {
        return baseCoin
    } else {
        return nativeTokens?.find((token) => token.id === assetId)
    }
}
