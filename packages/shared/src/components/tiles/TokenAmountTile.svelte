<script lang="ts">
    import { formatCurrency } from '@core/i18n/utils'
    import { getFiatValueFromTokenAmount, getMarketPriceForToken } from '@core/market/actions'
    import { ITokenWithBalance, formatTokenAmount } from '@core/token'
    import { truncateString } from '@core/utils'
    import { Tile, Text } from '@bloomwalletio/ui'
    import { TokenAvatar } from '@ui'

    export let token: ITokenWithBalance
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let amount: bigint = BigInt(0)
    export let hideTokenInfo: boolean = false
    export let error: boolean = false

    $: marketPrice = getMarketPriceForToken(token)
    $: fiatBalance = getFiatValueFromTokenAmount(BigInt(amount), token)
</script>

{#if token && token.metadata}
    <Tile {onClick} {selected} {error} surface={1} width={hideTokenInfo ? 'auto' : 'full'}>
        <div class="w-full flex flex-row items-center gap-2">
            <TokenAvatar {token} />
            <div class="flex flex-col w-full">
                <div class="flex flex-row w-full {hideTokenInfo ? 'justify-end' : 'justify-between'}">
                    {#if !hideTokenInfo}
                        <Text>
                            {token.metadata.name
                                ? truncateString(token.metadata.name, 13, 0)
                                : truncateString(token.id, 6, 7)}
                        </Text>
                    {/if}
                    <Text align="right">
                        {token.metadata ? formatTokenAmount(amount, token.metadata, { round: false }) : '-'}
                    </Text>
                </div>
                <div class="flex flex-row w-full {hideTokenInfo ? 'justify-end' : 'justify-between'}">
                    {#if !hideTokenInfo}
                        <Text fontWeight="medium" textColor="secondary">
                            {marketPrice ? formatCurrency(marketPrice) : '-'}
                        </Text>
                    {/if}
                    <Text fontWeight="medium" textColor="secondary" align="right">
                        {fiatBalance !== undefined ? `≈ ${formatCurrency(fiatBalance)}` : '-'}
                    </Text>
                </div>
            </div>
        </div>
    </Tile>
{/if}
