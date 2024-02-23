<script lang="ts">
    import { getAddressFromAccountForNetwork, IAccountState } from '@core/account'
    import { formatCurrency } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { IChain, NetworkHealth, NetworkId } from '@core/network'
    import { ownedNfts, selectedAccountNfts } from '@core/nfts/stores'
    import { formatTokenAmountBestMatch, ITokenWithBalance } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import type { IAccountNetworkSummaryProps } from '../interfaces'
    import AccountNetworkSummary from './AccountNetworkSummary.svelte'

    export let account: IAccountState
    export let chain: IChain

    $: networkId = chain?.getConfiguration()?.id as NetworkId 

    let props: IAccountNetworkSummaryProps | undefined
    $: $selectedAccountTokens, $selectedAccountNfts, account, (props = buildAccountEvmChainSummaryProps())

    function buildAccountEvmChainSummaryProps(): IAccountNetworkSummaryProps | undefined {
        const tokens = $selectedAccountTokens?.[networkId]
        const evmChainBaseToken: ITokenWithBalance = tokens?.baseCoin
        const tokenBalance = formatTokenAmountBestMatch(
            evmChainBaseToken?.balance.total ?? BigInt(0),
            evmChainBaseToken?.metadata
        )
        /**
         * NOTE: This logic used the market prices of the base token for L1 as we do not yet have market prices
         * for L2 tokens.
         */
        const fiatBalance =
            formatCurrency(
                getFiatValueFromTokenAmount(BigInt(evmChainBaseToken?.balance.total ?? 0), evmChainBaseToken)
            ) ?? ''

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
