<script lang="ts">
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue, getMarketPriceForToken } from '@core/market/actions'
    import { SupportedNetworkId, TokenSupply, getActiveNetworkId, getNameFromNetworkId } from '@core/network'
    import { BASE_TOKEN_ID, ITokenWithBalance, formatTokenAmountBestMatch, getUnitFromTokenMetadata } from '@core/token'
    import { truncateString } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { TokenAvatar, NetworkAvatar } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'

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
        return marketPrice ? formatCurrency(marketPrice, $activeProfile.settings.marketCurrency, true) : '-'
    }

    function getFormattedMarketPriceForToken(token: ITokenWithBalance): string {
        const marketPrice = getMarketPriceForToken(token)
        return marketPrice ? formatCurrency(marketPrice) : '-'
    }

    function getFormattedMarketPriceForTokenAvailable(token: ITokenWithBalance): string {
        const marketPrice = getMarketAmountFromTokenValue(token.balance.available, token)
        return marketPrice || marketPrice === 0 ? formatCurrency(marketPrice) : '-'
    }

    function getFormattedMarketPriceForTokenTotal(token: ITokenWithBalance): string {
        const marketPrice = getMarketAmountFromTokenValue(token.balance.total, token)
        return marketPrice || marketPrice === 0 ? formatCurrency(marketPrice) : '-'
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
        <TokenAvatar {token} size="lg" />
        <div class="flex flex-col items-start justify-between text-start">
            <Text>
                {token.metadata?.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)}
            </Text>
            <Text type="sm" textColor="secondary">
                {token.metadata ? getUnitFromTokenMetadata(token.metadata) : ''}
            </Text>
        </div>
    </div>
    <div class="flex flex-row gap-2 text-start items-center">
        <NetworkAvatar size="xs" networkId={token.networkId} />
        <Text>{getNameFromNetworkId(token.networkId)}</Text>
    </div>
    <div class="text-end">
        <Text>{getTokenSupply(token)}</Text>
    </div>
    <div class="text-end">
        <Text>{getFormattedMarketPriceForToken(token)}</Text>
    </div>
    <div class="flex flex-col items-end text-end">
        <Text>
            {token.metadata ? formatTokenAmountBestMatch(token.balance.available, token.metadata) : '-'}
        </Text>
        <Text textColor="secondary">
            {getFormattedMarketPriceForTokenAvailable(token)}
        </Text>
    </div>
    <div class="flex flex-col items-end text-end">
        <Text>
            {token.metadata ? formatTokenAmountBestMatch(token.balance.total, token.metadata) : '-'}
        </Text>
        <Text textColor="secondary">
            {getFormattedMarketPriceForTokenTotal(token)}
        </Text>
    </div>
</button>

<style lang="scss">
    .token-row {
        @apply w-full;
        @apply px-5 py-3.5;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;

        @apply grid gap-2;
        grid-template-columns: 3fr 2fr 2fr 2fr 2fr 2fr;
    }
</style>
