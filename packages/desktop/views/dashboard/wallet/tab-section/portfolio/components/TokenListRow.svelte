<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { formatCurrency } from '@core/i18n'
    import { getFiatValueFromTokenAmount, getMarketPriceForToken } from '@core/market/actions'
    import { BASE_TOKEN_SUPPLY_FOR_NETWORK } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { BASE_TOKEN_ID, ITokenWithBalance, formatTokenAmount } from '@core/token'
    import { truncateString } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { NetworkAvatar, NetworkTypePill, TokenAvatar } from '@ui'
    import TokenStandardPill from './TokenStandardPill.svelte'

    export let token: ITokenWithBalance

    function getTokenSupply(token: ITokenWithBalance): string {
        if (token.id !== BASE_TOKEN_ID) {
            return '-'
        }

        const tokenSupply: bigint | undefined = BASE_TOKEN_SUPPLY_FOR_NETWORK[token.networkId]

        const marketPrice = tokenSupply ? getFiatValueFromTokenAmount(BigInt(tokenSupply), token) : undefined
        return marketPrice ? formatCurrency(marketPrice, $activeProfile.settings.marketCurrency, true) : '-'
    }

    function getFormattedMarketPriceForToken(token: ITokenWithBalance): string {
        const marketPrice = getMarketPriceForToken(token)
        return marketPrice ? formatCurrency(marketPrice) : '-'
    }

    function getFormattedMarketPriceForTokenAvailable(token: ITokenWithBalance): string {
        const marketPrice = getFiatValueFromTokenAmount(BigInt(token.balance.available), token)
        return marketPrice || marketPrice === '0' ? formatCurrency(marketPrice) : '-'
    }

    function getFormattedMarketPriceForTokenTotal(token: ITokenWithBalance): string {
        const marketPrice = getFiatValueFromTokenAmount(BigInt(token.balance.total), token)
        return marketPrice || marketPrice === '0' ? formatCurrency(marketPrice) : '-'
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
    <div class="flex flex-row gap-4 items-center">
        <TokenAvatar {token} size="lg" hideNetworkBadge />
        <div class="flex flex-col items-start justify-between text-start">
            <Text>
                {token.metadata?.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)}
            </Text>
            <div class="flex gap-2">
                <TokenStandardPill {token} />
                <NetworkTypePill networkId={token.networkId} />
            </div>
        </div>
    </div>
    <div class="h-full flex flex-row gap-2 justify-center items-center">
        <NetworkAvatar networkId={token.networkId} showTooltip />
    </div>
    <div class="text-end">
        <Text>{getTokenSupply(token)}</Text>
    </div>
    <div class="text-end">
        <Text>{getFormattedMarketPriceForToken(token)}</Text>
    </div>
    <div class="flex flex-col items-end text-end">
        <Text>
            {token.metadata ? formatTokenAmount(token.balance.available, token.metadata) : '-'}
        </Text>
        <Text textColor="secondary">
            {getFormattedMarketPriceForTokenAvailable(token)}
        </Text>
    </div>
    <div class="flex flex-col items-end text-end">
        <Text>
            {token.metadata ? formatTokenAmount(token.balance.total, token.metadata) : '-'}
        </Text>
        <Text textColor="secondary">
            {getFormattedMarketPriceForTokenTotal(token)}
        </Text>
    </div>
</button>

<style lang="postcss">
    .token-row {
        @apply w-full;
        @apply px-5 py-3.5;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;

        @apply grid gap-2;
        grid-template-columns: 3fr 2fr 2fr 2fr 2fr 2fr;
    }
</style>
