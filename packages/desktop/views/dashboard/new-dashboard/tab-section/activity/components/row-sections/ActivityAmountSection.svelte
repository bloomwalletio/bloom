<script lang="ts">
    import { FontWeight, Text } from '@ui'
    import {
        Activity,
        ActivityType,
        GovernanceAction,
        getFormattedVotingPowerFromGovernanceActivity,
    } from '@core/activity'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'

    export let activity: Activity
    export let token: ITokenWithBalance | undefined

    function getAmount(): string {
        if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
            const amount = activity.tokenTransfer?.rawAmount ?? activity.baseTokenTransfer.rawAmount
            return token.metadata ? formatTokenAmountBestMatch(Number(amount), token.metadata) : amount
        } else if (activity.type === ActivityType.Consolidation) {
            return String(activity.amountConsolidatedInputs)
        } else if (activity.type === ActivityType.Governance) {
            const isVotingPowerActivity =
                activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
                activity.governanceAction === GovernanceAction.IncreaseVotingPower

            return isVotingPowerActivity ? getFormattedVotingPowerFromGovernanceActivity(activity) : '-'
        } else {
            return '-'
        }
    }

    function getFormattedMarketPrice(): string {
        if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
            const amount = activity.tokenTransfer?.rawAmount ?? activity.baseTokenTransfer.rawAmount

            const marketPrice = getMarketAmountFromTokenValue(Number(amount), token)
            return marketPrice ? formatCurrency(marketPrice) : '-'
        } else {
            return undefined
        }
    }
</script>

<Text fontWeight={FontWeight.semibold} classes="text-end">{getAmount()}</Text>
{#if getFormattedMarketPrice()}
    <Text fontWeight={FontWeight.semibold} secondary classes="text-end">{getFormattedMarketPrice()}</Text>
{/if}
