<script lang="ts">
    import { formatCurrency } from '@core/i18n/utils'
    import { getMarketAmountFromTokenValue, getMarketPriceForToken } from '@core/market/actions'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { truncateString } from '@core/utils'
    import { Tile, Text } from '@bloomwalletio/ui'
    import { TokenAvatar } from '@ui'

    export let token: ITokenWithBalance
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let amount: number = 0
    export let hideTokenInfo: boolean = false
    export let error: boolean = false

    $: marketPrice = getMarketPriceForToken(token)
    $: marketBalance = getMarketAmountFromTokenValue(amount, token)
</script>

{#if token && token.metadata}
    <Tile {onClick} {selected} {error} surface={1} fullWidth={!hideTokenInfo}>
        <div class="w-full flex flex-row justify-between items-center gap-2">
            <div class="flex flex-row items-center text-left space-x-3">
                <TokenAvatar {token} />
                {#if !hideTokenInfo}
                    <div class="flex flex-col">
                        <Text>
                            {token.metadata.name
                                ? truncateString(token.metadata.name, 13, 0)
                                : truncateString(token.id, 6, 7)}
                        </Text>
                        <div class="flex flex-row justify-between items-center text-left">
                            <Text fontWeight="medium" textColor="secondary">
                                {marketPrice ? formatCurrency(marketPrice) : ''}
                            </Text>
                            <slot name="subLabel" />
                        </div>
                    </div>
                {/if}
            </div>
            <div class="flex flex-col text-right">
                <Text>
                    {token.metadata ? formatTokenAmountBestMatch(amount, token.metadata) : '-'}
                </Text>
                <div class="flex flex-row items-center">
                    <Text fontWeight="medium" textColor="secondary">
                        {marketBalance !== undefined ? `≈ ${formatCurrency(marketBalance)}` : ''}
                    </Text>
                </div>
            </div>
        </div>
    </Tile>
{/if}
