<script lang="ts">
    import { Activity } from '@core/activity'
    import { formatCurrency } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { Text } from '@bloomwalletio/ui'
    import { selectedAccountTokens } from '@core/token/stores'

    export let activity: Activity

    $: baseCoin = $selectedAccountTokens?.[activity.sourceNetworkId]?.baseCoin

    function getFormattedFee(_activity: Activity, baseCoin: ITokenWithBalance | undefined): string {
        if (_activity.transactionFee && baseCoin) {
            const amount = formatTokenAmountBestMatch(_activity.transactionFee, baseCoin.metadata, { decimals: 3 })
            return '- ' + amount
        } else {
            return '-'
        }
    }

    function getFormattedMarketPrice(_activity: Activity, baseCoin: ITokenWithBalance | undefined): string | undefined {
        if (_activity.transactionFee && baseCoin) {
            const marketPrice = getFiatValueFromTokenAmount(_activity.transactionFee, baseCoin)
            return marketPrice ? formatCurrency(marketPrice) : '-'
        } else {
            return undefined
        }
    }
</script>

<div class="text-end">
    <Text>{getFormattedFee(activity, baseCoin)}</Text>
    {#if activity.transactionFee}
        <Text textColor="secondary">{getFormattedMarketPrice(activity, baseCoin)}</Text>
    {/if}
</div>
