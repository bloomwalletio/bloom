<script lang="ts">
    import { getActiveNetworkId, getNetwork, NetworkId } from '@core/network'
    import { getAddressFromAccountForNetwork, IAccountState } from '@core/account'
    import { formatTokenAmountBestMatch, ITokenWithBalance } from '@core/token'
    import { getAccountTokensForSelectedAccount } from '@core/token/actions'
    import { marketCoinPrices } from '@core/market/stores'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'

    import AccountNetworkSummary from './AccountNetworkSummary.svelte'
    import type { IAccountNetworkSummaryProps } from '../interfaces'

    export let account: IAccountState
    export let networkId: NetworkId

    function buildAccountEvmChainSummaryProps(): IAccountNetworkSummaryProps {
        const chain = getNetwork().getChain(networkId)
        const networkName = chain.getConfiguration().name
        const networkHealth = chain.getStatus().health
        const networkAddress = getAddressFromAccountForNetwork(account, networkId)
        const selectedAccountTokens = getAccountTokensForSelectedAccount($marketCoinPrices)
        const stardustNetworkBaseToken = selectedAccountTokens?.[getActiveNetworkId()]?.baseCoin
        const evmChainBaseToken: ITokenWithBalance = selectedAccountTokens?.[networkId]?.baseCoin
        const networkTokenBalance = formatTokenAmountBestMatch(
            evmChainBaseToken.balance.total,
            evmChainBaseToken.metadata
        )
        /**
         * NOTE: This logic used the market prices of the base token for L1 as we do not yet have market prices
         * for L2 tokens.
         */
        const networkFiatBalance =
            formatCurrency(getMarketAmountFromTokenValue(evmChainBaseToken.balance.total, stardustNetworkBaseToken)) ??
            ''
        const networkTokens = selectedAccountTokens?.[networkId]

        return {
            networkId,
            networkName,
            networkHealth,
            networkAddress,
            networkTokenBalance,
            networkFiatBalance,
            networkTokens,
        }
    }
</script>

<AccountNetworkSummary props={buildAccountEvmChainSummaryProps()} />
