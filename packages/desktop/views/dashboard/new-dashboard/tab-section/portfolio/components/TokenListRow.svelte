<script lang="ts">
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue, getMarketPriceForToken } from '@core/market/actions'
    import { getNameFromNetworkId } from '@core/network'
    import { ITokenWithBalance, formatTokenAmountBestMatch, getUnitFromTokenMetadata } from '@core/token'
    import { truncateString } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { FontWeight, Text, TokenAvatar } from '@ui'

    export let token: ITokenWithBalance

    function getFormattedMarketPriceForToken(token: ITokenWithBalance): string {
        const marketPrice = getMarketPriceForToken(token)
        return marketPrice ? formatCurrency(marketPrice) : '-'
    }

    function getFormattedMarketPriceForTokenAmount(token: ITokenWithBalance): string {
        const marketPrice = getMarketAmountFromTokenValue(token.balance.total, token)
        return marketPrice ? formatCurrency(marketPrice) : '-'
    }

    function onTokenRowClick(): void {
        openPopup({
            id: PopupId.TokenInformation,
            overflow: true,
            props: {
                token,
            },
        })
    }
</script>


<button on:click={onTokenRowClick} class="token-row">
    <div class="flex flex-row gap-4 items-start">
        <TokenAvatar token={token} size="md" />
        <div class="flex flex-col items-start justify-between">
            <Text fontWeight={FontWeight.semibold}>
                {token.metadata.name
                    ? truncateString(token.metadata.name, 13, 0)
                    : truncateString(token.id, 6, 7)}
            </Text>
            <Text secondary fontWeight={FontWeight.semibold}>
                {getUnitFromTokenMetadata(token.metadata)}
            </Text>
        </div>
    </div>
    <Text fontWeight={FontWeight.semibold} classes="text-start"
        >{getNameFromNetworkId(token.networkId)}</Text
    >
    <Text fontWeight={FontWeight.semibold} classes="text-start">-</Text>
    <Text fontWeight={FontWeight.semibold} classes="text-start"
        >{getFormattedMarketPriceForToken(token)}</Text
    >
    <div class="flex flex-col items-end">
        <Text fontWeight={FontWeight.semibold} classes="text-end"
            >{token.metadata
                ? formatTokenAmountBestMatch(token.balance.total, token.metadata)
                : '-'}</Text
        >
        <Text fontWeight={FontWeight.semibold} secondary classes="text-end"
            >{getFormattedMarketPriceForTokenAmount(token)}</Text
        >
    </div>
</button>

<style lang="scss">
    .token-row {
        @apply w-full;
        @apply px-5 py-4;
        @apply border-b border-solid border-gray-100;
        @apply hover:bg-gray-50;

        @apply grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 2fr;
    }
</style>