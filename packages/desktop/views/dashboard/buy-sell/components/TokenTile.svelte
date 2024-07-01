<script lang="ts">
    import { formatCurrency } from '@core/i18n/utils'
    import { getMarketPriceForToken, getTokenValueFromFiatAmount } from '@core/market/actions'
    import { formatTokenAmount } from '@core/token'
    import { truncateString } from '@core/utils'
    import { Tile, Text } from '@bloomwalletio/ui'
    import { TokenAvatar } from '@ui'
    import { selectedAccountTokens } from '@core/token/stores'
    import { SupportedStardustNetworkId } from '@core/network'
    import { MarketCurrency } from '@core/market'

    export let token = $selectedAccountTokens[SupportedStardustNetworkId.Iota]?.baseCoin
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let fiatValue = '0'
    export let currency: MarketCurrency

    $: marketPrice = token ? getMarketPriceForToken(token, currency) : undefined
    $: tokenAmount = token && currency ? getTokenValueFromFiatAmount(fiatValue, token, currency) : BigInt(0)
</script>

{#if token && token.metadata}
    <Tile {onClick} {selected} surface={1} width="full">
        <div class="w-full flex flex-row items-center gap-2">
            <TokenAvatar {token} />
            <div class="flex flex-col w-full">
                <div class="flex flex-row w-full justify-between">
                    <Text>
                        {token.metadata.name
                            ? truncateString(token.metadata.name, 13, 0)
                            : truncateString(token.id, 6, 7)}
                    </Text>
                    <Text align="right">
                        {token.metadata
                            ? `≈ ${formatTokenAmount(tokenAmount ?? BigInt(0), token.metadata, { round: false })}`
                            : '-'}
                    </Text>
                </div>
                <div class="flex flex-row w-full justify-between">
                    <Text fontWeight="medium" textColor="secondary">
                        {marketPrice ? formatCurrency(marketPrice, currency) : '-'}
                    </Text>
                    <Text fontWeight="medium" textColor="secondary" align="right">
                        {fiatValue !== undefined ? formatCurrency(fiatValue ?? '', currency) : '-'}
                    </Text>
                </div>
            </div>
        </div>
    </Tile>
{/if}
