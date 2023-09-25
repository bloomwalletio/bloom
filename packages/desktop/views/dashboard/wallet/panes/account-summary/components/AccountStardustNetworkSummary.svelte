<script lang="ts">
    import { getNetwork, NetworkHealth, NetworkId } from '@core/network'
    import { IAccountState } from '@core/account'
    import { formatTokenAmountBestMatch, ITokenWithBalance } from '@core/token'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { ownedNfts } from '@core/nfts/stores'
    import { selectedAccountTokens } from '@core/token/stores'

    import AccountNetworkSummary from './AccountNetworkSummary.svelte'
    import type { IAccountNetworkSummaryProps } from '../interfaces'

    export let account: IAccountState
    export let networkId: NetworkId

    let props: IAccountNetworkSummaryProps | undefined
    $: $selectedAccountTokens, account, (props = buildAccountStardustNetworkSummaryProps())

    function buildAccountStardustNetworkSummaryProps(): IAccountNetworkSummaryProps {
        const network = getNetwork()
        const tokens = $selectedAccountTokens?.[networkId]
        const networkBaseCoin: ITokenWithBalance = tokens?.baseCoin
        const tokenBalance = formatTokenAmountBestMatch(networkBaseCoin.balance.total, networkBaseCoin.metadata)
        const fiatBalance = formatCurrency(
            getMarketAmountFromTokenValue(networkBaseCoin.balance.total, networkBaseCoin)
        )

        return {
            networkId,
            name: network.getMetadata().name,
            health: network.getStatus()?.health ?? NetworkHealth.Disconnected,
            address: account.depositAddress,
            tokenBalance,
            fiatBalance,
            tokens,
            nfts: $ownedNfts,
        }
    }
</script>

<AccountNetworkSummary {...props} />
