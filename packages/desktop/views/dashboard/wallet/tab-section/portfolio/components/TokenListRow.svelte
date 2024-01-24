<script lang="ts">
    import { formatCurrency } from '@core/i18n'
    import { getFiatValueFromTokenAmount, getMarketPriceForToken } from '@core/market/actions'
    import {
        ChainType,
        SupportedNetworkId,
        TokenSupply,
        getActiveNetworkId,
        getChainConfiguration,
    } from '@core/network'
    import { BASE_TOKEN_ID, ITokenWithBalance, TokenStandard, formatTokenAmountBestMatch } from '@core/token'
    import { truncateString } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { TokenAvatar, NetworkAvatar } from '@ui'
    import { Pill, Text, Tooltip } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'

    export let token: ITokenWithBalance

    let anchor: HTMLDivElement

    function getTokenSupply(token: ITokenWithBalance): string {
        if (token.id !== BASE_TOKEN_ID) {
            return '-'
        }

        let tokenSupply: TokenSupply | '0'
        switch (getActiveNetworkId()) {
            case SupportedNetworkId.Iota:
                tokenSupply = TokenSupply.Iota
                break
            case SupportedNetworkId.Shimmer:
            case SupportedNetworkId.Testnet:
                tokenSupply = TokenSupply.Shimmer
                break
            default:
                tokenSupply = '0'
        }

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
    <div class="flex flex-row gap-4 items-start">
        <TokenAvatar {token} size="lg" hideNetworkBadge />
        <div class="flex flex-col items-start justify-between text-start">
            <Text>
                {token.metadata?.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)}
            </Text>
            <div class="flex gap-2">
                <Pill color="neutral" compact>
                    {token.standard === TokenStandard.BaseToken
                        ? 'Base'
                        : token.standard === TokenStandard.Erc20
                        ? 'ERC20'
                        : token.standard === TokenStandard.Irc30
                        ? 'IRC30'
                        : undefined}
                </Pill>
                {#if token.networkId !== getActiveNetworkId()}
                    {@const chainType = getChainConfiguration(token.networkId).type}
                    <div bind:this={anchor}>
                        <Pill color="cyan" compact>
                            {chainType === ChainType.Evm ? 'EVM' : chainType === ChainType.Iscp ? 'ISC' : undefined}
                        </Pill>
                    </div>
                    <Tooltip
                        {anchor}
                        placement="top"
                        event="hover"
                        text={chainType === ChainType.Evm
                            ? 'Ethereum'
                            : chainType === ChainType.Iscp
                            ? 'IOTA Smart Contracts'
                            : undefined}
                    />
                {/if}
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
