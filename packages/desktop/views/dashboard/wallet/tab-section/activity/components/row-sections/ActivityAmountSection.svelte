<script lang="ts">
    import {
        Activity,
        ActivityType,
        GovernanceAction,
        getFormattedVotingPowerFromGovernanceActivity,
    } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { Text } from '@bloomwalletio/ui'
    import { selectedAccountTokens } from '@core/token/stores'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    function getAmount(_activity: Activity): string {
        if (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) {
            const amount = _activity.tokenTransfer?.rawAmount ?? _activity.baseTokenTransfer.rawAmount
            return token?.metadata ? formatTokenAmountBestMatch(Number(amount), token.metadata) : amount
        } else if (_activity.type === ActivityType.Consolidation) {
            return String(_activity.amountConsolidatedInputs)
        } else if (_activity.type === ActivityType.Governance) {
            const isVotingPowerActivity =
                _activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
                _activity.governanceAction === GovernanceAction.IncreaseVotingPower

            return isVotingPowerActivity ? getFormattedVotingPowerFromGovernanceActivity(_activity) : '-'
        } else {
            return '-'
        }
    }

    function getFormattedMarketPrice(_activity: Activity): string | undefined {
        if ((_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) && token) {
            const amount = _activity.tokenTransfer?.rawAmount ?? _activity.baseTokenTransfer.rawAmount

            const marketPrice = getMarketAmountFromTokenValue(Number(amount), token)
            return marketPrice ? formatCurrency(marketPrice) : '-'
        } else {
            return undefined
        }
    }
</script>

<div class="text-end">
    <Text>{getAmount(activity)}</Text>
    {#if getFormattedMarketPrice(activity)}
        <Text color="secondary">{getFormattedMarketPrice(activity)}</Text>
    {/if}
</div>
