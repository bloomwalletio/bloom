<script lang="ts">
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue, getMarketPriceForToken } from '@core/market/actions'
    import { SupportedNetworkId, TokenSupply, getActiveNetworkId, getNameFromNetworkId } from '@core/network'
    import { BASE_TOKEN_ID, ITokenWithBalance, formatTokenAmountBestMatch, getUnitFromTokenMetadata } from '@core/token'
    import { truncateString } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { TokenAvatar } from '@ui'
    import { Text } from '@bloomwalletio/ui'

    export let token: ITokenWithBalance

    function getTokenSupply(token: ITokenWithBalance): string {
        if (token.id !== BASE_TOKEN_ID) {
            return '-'
        }

        let tokenSupply: number | undefined
        switch (getActiveNetworkId()) {
            case SupportedNetworkId.Shimmer:
                tokenSupply = Number(TokenSupply.Shimmer)
                break
            case SupportedNetworkId.Testnet:
                tokenSupply = Number(TokenSupply.Shimmer)
                break
            default:
                tokenSupply = 0
        }

        const marketPrice = tokenSupply ? getMarketAmountFromTokenValue(Number(TokenSupply.Testnet), token) : undefined
        return marketPrice ? formatCurrency(marketPrice) : '-'
    }

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
        <TokenAvatar {token} size="md" />
        <div class="flex flex-col items-start justify-between text-start">
            <Text type="base" fontWeight="semibold">
                {token.metadata.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)}
            </Text>
            <Text type="sm" fontWeight="semibold" color="secondary">
                {getUnitFromTokenMetadata(token.metadata)}
            </Text>
        </div>
    </div>
    <div class="text-start">
        <Text type="base" fontWeight="semibold">{getNameFromNetworkId(token.networkId)}</Text>
    </div>
    <div class="text-start">
        <Text type="base" fontWeight="semibold">{getTokenSupply(token)}</Text>
    </div>
    <div class="text-start">
        <Text type="base" fontWeight="semibold">{getFormattedMarketPriceForToken(token)}</Text>
    </div>

    <div class="flex flex-col items-end text-end">
        <Text type="base" fontWeight="semibold">
            {token.metadata ? formatTokenAmountBestMatch(token.balance.total, token.metadata) : '-'}
        </Text>
        <Text type="base" fontWeight="semibold" color="secondary">
            {getFormattedMarketPriceForTokenAmount(token)}
        </Text>
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
