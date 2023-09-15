<script lang="ts">
    import { getNetwork, NetworkHealth, NetworkId } from '@core/network'
    import { IAccountState } from '@core/account'
    import { getAccountTokensForSelectedAccount } from '@core/token/actions'
    import { marketCoinPrices } from '@core/market/stores'
    import { formatTokenAmountBestMatch, ITokenWithBalance } from '@core/token'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'

    import AccountNetworkSummary from './AccountNetworkSummary.svelte'
    import type { IAccountNetworkSummaryProps } from '../interfaces'

    export let account: IAccountState
    export let networkId: NetworkId

    function buildAccountStardustNetworkSummaryProps(): IAccountNetworkSummaryProps {
        const network = getNetwork()
        const networkName = network.getMetadata().name
        const networkHealth = network.getStatus()?.health ?? NetworkHealth.Disconnected
        const networkAddress = account.depositAddress
        const networkTokens = getAccountTokensForSelectedAccount($marketCoinPrices)?.[networkId]
        const networkBaseCoin: ITokenWithBalance = networkTokens?.baseCoin
        const networkTokenBalance = formatTokenAmountBestMatch(networkBaseCoin.balance.total, networkBaseCoin.metadata)
        const networkFiatBalance = formatCurrency(
            getMarketAmountFromTokenValue(networkBaseCoin.balance.total, networkBaseCoin)
        )

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

<AccountNetworkSummary props={buildAccountStardustNetworkSummaryProps()} />
