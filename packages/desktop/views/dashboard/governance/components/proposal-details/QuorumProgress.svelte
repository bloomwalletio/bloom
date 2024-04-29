<script lang="ts">
    import {
        IProposal,
        getCirculatingSupplyVotedPercentage,
        selectedParticipationEventStatus,
    } from '@contexts/governance'
    import { Text, Progress, TooltipIcon } from '@bloomwalletio/ui'
    import { getDecimalSeparator, localize } from '@core/i18n'
    import { getL1Network } from '@core/network'
    import { getSignificantDigitsAndRound } from '@core/utils'

    export let proposal: IProposal
    export let projected: boolean = false

    const QUORUM_PERCENTAGE_DECIMAL = 0.05

    const currentMilestone = getL1Network().currentMilestone

    $: ({ actualPercentage, projectedPercentage } = getCirculatingSupplyVotedPercentage(
        $selectedParticipationEventStatus,
        proposal,
        $currentMilestone
    ))

    $: percentage = projected ? projectedPercentage : actualPercentage

    function formatPercentage(percentage: number): string {
        const percentageWithSignificantDigits = getSignificantDigitsAndRound(Number(percentage) * 100)
        const percentageString = String(percentageWithSignificantDigits).replace(/[,.]/g, getDecimalSeparator()) + '%'
        return percentageString
    }
</script>

<div class="flex flex-col gap-1">
    <div class="flex justify-between gap-1">
        <div class="flex items-center gap-2">
            <Text align="center">{localize('views.governance.details.quorum.title')}</Text>
            <TooltipIcon tooltip={localize('views.governance.details.quorum.tooltip')} />
        </div>
        <div class="flex gap-1">
            <Text align="center" fontWeight="medium" textColor="brand">
                {formatPercentage(percentage)} / {QUORUM_PERCENTAGE_DECIMAL * 100}%
            </Text>
        </div>
    </div>
    <Progress size="sm" progress={(percentage / QUORUM_PERCENTAGE_DECIMAL) * 100} />
</div>
