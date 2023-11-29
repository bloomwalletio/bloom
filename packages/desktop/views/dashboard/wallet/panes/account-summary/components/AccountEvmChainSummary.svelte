<script lang="ts">
    import { getNetwork, NetworkHealth, NetworkId } from '@core/network'
    import { getAddressFromAccountForNetwork, IAccountState } from '@core/account'
    import { formatTokenAmountBestMatch, ITokenWithBalance } from '@core/token'
    import { formatCurrency } from '@core/i18n'
    import { getFiatAmountFromTokenValue } from '@core/market/actions'
    import { selectedAccountTokens } from '@core/token/stores'
    import AccountNetworkSummary from './AccountNetworkSummary.svelte'
    import type { IAccountNetworkSummaryProps } from '../interfaces'
    import { ownedNfts, selectedAccountNfts } from '@core/nfts/stores'

    export let account: IAccountState
    export let networkId: NetworkId

    let props: IAccountNetworkSummaryProps | undefined
    $: $selectedAccountTokens, $selectedAccountNfts, account, (props = buildAccountEvmChainSummaryProps())

    function buildAccountEvmChainSummaryProps(): IAccountNetworkSummaryProps | undefined {
        const chain = getNetwork()?.getChain(networkId)
        const tokens = $selectedAccountTokens?.[networkId]
        const evmChainBaseToken: ITokenWithBalance = tokens?.baseCoin
        const tokenBalance = formatTokenAmountBestMatch(
            evmChainBaseToken?.balance.total ?? 0,
            evmChainBaseToken?.metadata
        )
        /**
         * NOTE: This logic used the market prices of the base token for L1 as we do not yet have market prices
         * for L2 tokens.
         */
        const fiatBalance =
            formatCurrency(getFiatAmountFromTokenValue(evmChainBaseToken?.balance.total ?? 0, evmChainBaseToken)) ?? ''

        return {
            networkId,
            name: chain?.getConfiguration().name ?? '',
            health: chain?.getStatus().health ?? NetworkHealth.Disconnected,
            address: getAddressFromAccountForNetwork(account, networkId),
            tokenBalance,
            fiatBalance,
            tokens,
            nfts: $ownedNfts.filter((nft) => nft.networkId === networkId),
        }
    }
</script>

{#if props}
    <AccountNetworkSummary {...props} />
{/if}
