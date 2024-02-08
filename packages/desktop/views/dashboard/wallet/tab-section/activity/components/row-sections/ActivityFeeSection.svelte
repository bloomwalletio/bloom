<script lang="ts">
    import { Activity } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { formatCurrency } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { Text } from '@bloomwalletio/ui'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getBaseToken } from '@core/profile/actions'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    function getFormattedFee(_activity: Activity): string {
        if (_activity.transactionFee) {
            const amount = formatTokenAmountBestMatch(_activity.transactionFee, getBaseToken(), { decimals: 3 })
            return '- ' + amount
        } else {
            return '-'
        }
    }

    function getFormattedMarketPrice(_activity: Activity): string | undefined {
        const baseCoin = $selectedAccountTokens?.[activity.sourceNetworkId]?.baseCoin
        if (_activity.transactionFee && baseCoin) {
            const marketPrice = getFiatValueFromTokenAmount(_activity.transactionFee, baseCoin)
            return marketPrice ? formatCurrency(marketPrice) : '-'
        } else {
            return undefined
        }
    }
</script>

<div class="text-end">
    <Text>{getFormattedFee(activity)}</Text>
    {#if activity.transactionFee}
        <Text textColor="secondary">{getFormattedMarketPrice(activity)}</Text>
    {/if}
</div>
