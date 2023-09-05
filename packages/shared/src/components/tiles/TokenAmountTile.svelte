<script lang="ts">
    import { formatCurrency } from '@core/i18n/utils'
    import { getMarketPriceForToken } from '@core/market/utils'
    import { getMarketAmountFromTokenValue } from '@core/market/utils/getMarketAmountFromTokenValue'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { truncateString } from '@core/utils'
    import { ClickableTile, FontWeight, Text, TextType, TokenAvatar } from '@ui'

    export let token: ITokenWithBalance
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let classes = ''
    export let amount: number = 0
    export let hideTokenInfo: boolean = false
    export let hasError: boolean = false

    $: marketPrice = getMarketPriceForToken(token)
    $: marketBalance = getMarketAmountFromTokenValue(amount, token)
</script>

{#if token && token.metadata}
    <ClickableTile
        {onClick}
        classes="border-2 border-solid {hasError
            ? 'border-red-500 dark:border-red-200'
            : selected
            ? 'border-blue-500 dark:border-gray-500'
            : 'border-transparent'} {classes}"
        fullWidth={!hideTokenInfo}
        {...$$restProps}
    >
        <div class="w-full flex flex-row justify-between items-center gap-2">
            <div class="flex flex-row items-center text-left space-x-4">
                <TokenAvatar {token} />
                {#if !hideTokenInfo}
                    <div class="flex flex-col">
                        <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                            {token.metadata.name
                                ? truncateString(token.metadata.name, 13, 0)
                                : truncateString(token.id, 6, 7)}
                        </Text>
                        <div class="flex flex-row justify-between items-center text-left">
                            <Text type={TextType.p} secondary smaller
                                >{marketPrice ? formatCurrency(marketPrice) : ''}</Text
                            >
                            <slot name="subLabel" />
                        </div>
                    </div>
                {/if}
            </div>
            <div class="flex flex-col text-right">
                <Text type={TextType.p} fontWeight={FontWeight.semibold} whitespace="nowrap">
                    {token.metadata ? formatTokenAmountBestMatch(amount, token.metadata) : '-'}
                </Text>
                <div class="flex flex-row justify-between items-center text-right">
                    <Text type={TextType.p} secondary smaller classes="flex-grow">
                        {marketBalance ? `≈ ${formatCurrency(marketBalance)}` : ''}
                    </Text>
                </div>
            </div>
        </div>
    </ClickableTile>
{/if}
