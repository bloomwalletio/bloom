import { selectedAccount } from '@core/account/stores/selected-account.store'
import { layer2Balances } from '@core/layer-2/stores/layer2-balances.store'
import { marketCoinPrices } from '@core/market/stores/market-coin-prices.store'
import { NetworkId } from '@core/network'
import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { getAccountTokensForAccount } from '../actions/getAccountTokensForAccount'
import { DEFAULT_ASSET_FILTER } from '../constants'
import { ITokenWithBalance, TokenFilter } from '../interfaces'
import { AccountTokens, IAccountTokensPerNetwork } from '../interfaces/account-tokens.interface'
import { getPersistedToken, persistedTokens } from './persisted-tokens.store'
import { activeAccounts, activeProfile } from '@core/profile/stores'
import { tryNumberOrZero } from '@core/utils'

export const tokenFilter: Writable<TokenFilter> = writable(DEFAULT_ASSET_FILTER)

export const tokenSearchTerm: Writable<string> = writable('')

export const allAccountTokens: Readable<{ [accountIndex: string]: AccountTokens }> = derived(
    [
        activeProfileId,
        activeAccounts,
        marketCoinPrices,
        activeProfile,
        selectedAccount,
        persistedTokens,
        tokenFilter,
        layer2Balances,
    ],
    ([$activeProfileId, $activeAccounts, $marketCoinPrices, $activeProfile]) => {
        const _allAccountTokens: Record<number, AccountTokens> = {}
        if ($activeProfileId) {
            for (const account of $activeAccounts) {
                _allAccountTokens[account.index] = getAccountTokensForAccount(
                    account,
                    $marketCoinPrices,
                    $activeProfile?.settings?.marketCurrency
                )
            }
            return _allAccountTokens
        } else {
            return _allAccountTokens
        }
    }
)

interface IAccountFiatBalances {
    [networkId: string]: string
    total: string
}

export const allAccountFiatBalances: Readable<{ [accountIndex: string]: IAccountFiatBalances }> = derived(
    [allAccountTokens],
    ([$allAccountTokens]) => {
        const _allAccountFiatBalances: Record<string, IAccountFiatBalances> = {}
        for (const accountIndex of Object.keys($allAccountTokens)) {
            if (!_allAccountFiatBalances[accountIndex]) {
                _allAccountFiatBalances[accountIndex] = {
                    total: '0',
                }
            }

            const accountTokens = $allAccountTokens[accountIndex]
            let accountFiatBalance = 0
            for (const networkId of Object.keys(accountTokens)) {
                let networkFiatBalance = 0
                const tokens = accountTokens[networkId as NetworkId]
                networkFiatBalance += tryNumberOrZero(tokens?.baseCoin?.balance?.totalFiat)
                for (const token of tokens?.nativeTokens ?? []) {
                    const totalFiat = tryNumberOrZero(token.balance.totalFiat)
                    const fiatValue = Number.isFinite(totalFiat) ? totalFiat : 0
                    networkFiatBalance += fiatValue
                }
                _allAccountFiatBalances[accountIndex][networkId] = networkFiatBalance.toString()
                accountFiatBalance += networkFiatBalance
            }
            _allAccountFiatBalances[accountIndex].total = accountFiatBalance.toString()
        }
        return _allAccountFiatBalances
    }
)

export const selectedAccountTokens: Readable<AccountTokens> = derived(
    [allAccountTokens, selectedAccount],
    ([$allAccountTokens, $selectedAccount]) => {
        return $selectedAccount ? $allAccountTokens?.[$selectedAccount.index] ?? {} : {}
    }
)

export const visibleSelectedAccountTokens: Readable<AccountTokens> = derived(
    [selectedAccountTokens],
    ([$selectedAccountTokens]) => {
        const visibleTokens: AccountTokens = {}
        for (const _networkId of Object.keys($selectedAccountTokens)) {
            const networkId = _networkId as NetworkId
            const tokens = $selectedAccountTokens[networkId]
            if (tokens) {
                const visible: IAccountTokensPerNetwork = {
                    baseCoin: tokens.baseCoin,
                    nativeTokens: tokens.nativeTokens.filter((asset) => !asset.hidden) ?? [],
                }
                visibleTokens[networkId] = visible
            }
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
            const persistedToken = getPersistedToken(networkId, tokenId)
            return persistedToken
                ? {
                      ...persistedToken,
                      networkId,
                      balance: {
                          total: BigInt(0),
                          available: BigInt(0),
                      },
                  }
                : undefined
        }
    }
}
