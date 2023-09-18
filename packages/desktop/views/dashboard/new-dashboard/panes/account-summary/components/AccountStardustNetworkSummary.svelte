<script lang="ts">
    import { getNetwork, NetworkHealth, NetworkId } from '@core/network'
    import { IAccountState } from '@core/account'
    import { getAccountTokensForSelectedAccount } from '@core/token/actions'
    import { marketCoinPrices } from '@core/market/stores'
    import { formatTokenAmountBestMatch, ITokenWithBalance } from '@core/token'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { ownedNfts } from '@core/nfts/stores'

    import AccountNetworkSummary from './AccountNetworkSummary.svelte'
    import type { IAccountNetworkSummaryProps } from '../interfaces'

    export let account: IAccountState
    export let networkId: NetworkId

    function buildAccountStardustNetworkSummaryProps(): IAccountNetworkSummaryProps {
        const network = getNetwork()
        const networkTokens = getAccountTokensForSelectedAccount($marketCoinPrices)?.[networkId]
        const networkBaseCoin: ITokenWithBalance = networkTokens?.baseCoin
        const networkTokenBalance = formatTokenAmountBestMatch(networkBaseCoin.balance.total, networkBaseCoin.metadata)
        const networkFiatBalance = formatCurrency(
            getMarketAmountFromTokenValue(networkBaseCoin.balance.total, networkBaseCoin)
        )

        return {
            networkId,
            networkName: network.getMetadata().name,
            networkHealth: network.getStatus()?.health ?? NetworkHealth.Disconnected,
            networkAddress: account.depositAddress,
            networkTokenBalance,
            networkFiatBalance,
            networkTokens,
            networkNfts: $ownedNfts,
        }
    }
</script>

<AccountNetworkSummary props={buildAccountStardustNetworkSummaryProps()} />
