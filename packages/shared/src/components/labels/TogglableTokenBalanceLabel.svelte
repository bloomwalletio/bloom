<script lang="ts">
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/utils'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { FontWeight, Text, TextType } from '@ui'

    export let token: ITokenWithBalance

    $: availableMarketValue = getMarketAmountFromTokenValue(token?.balance?.available, token)
    $: totalMarketValue = getMarketAmountFromTokenValue(token?.balance?.total, token)
    $: disabled = Number.isNaN(totalMarketValue) || Number.isNaN(availableMarketValue)

    let isToggled = false
    function toggle(): void {
        isToggled = !isToggled
    }
</script>

{#if token}
    <button on:click={toggle} type="button" {disabled}>
        <div class="flex flex-col flex-wrap items-start space-y-1">
            <Text type={TextType.h1} fontWeight={FontWeight.semibold}>
                {isToggled
                    ? formatCurrency(totalMarketValue)
                    : formatTokenAmountBestMatch(token?.balance?.total, token?.metadata)}
            </Text>
            <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600" darkColor="gray-500">
                {localize('general.availableBalanceWithValue', {
                    values: {
                        balance: isToggled
                            ? formatCurrency(availableMarketValue)
                            : formatTokenAmountBestMatch(token?.balance?.available, token?.metadata),
                    },
                })}
            </Text>
        </div>
    </button>
{/if}

<style lang="scss">
    button {
        &:disabled {
            cursor: default;
        }
    }
</style>
