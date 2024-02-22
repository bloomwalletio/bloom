<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import {
        participationOverviewForSelectedAccount,
        selectedParticipationEventStatus,
        selectedProposal,
    } from '@contexts/governance/stores'
    import { calculateTotalVotesForTrackedParticipations } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { networkStatus } from '@core/network/stores'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { EventStatus } from '@iota/sdk/out/types'
    import { Pane, Text } from '@ui'

    const { metadata } = $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin ?? {}

    let totalVotes = BigInt(0)
    const hasMounted = false

    $: selectedProposalOverview = $participationOverviewForSelectedAccount?.participations?.[$selectedProposal?.id]
    $: trackedParticipations = Object.values(selectedProposalOverview ?? {})
    $: currentMilestone = $networkStatus.currentMilestone

    // Reactively start updating votes once component has mounted and participation overview is available.
    $: hasMounted && $selectedParticipationEventStatus && trackedParticipations && currentMilestone && setTotalVotes()

    function setTotalVotes(): void {
        switch ($selectedParticipationEventStatus?.status) {
            case EventStatus.Upcoming:
                totalVotes = BigInt(0)
                break
            case EventStatus.Commencing:
                totalVotes = BigInt(0)
                break
            case EventStatus.Holding:
                totalVotes = calculateTotalVotesForTrackedParticipations(trackedParticipations)
                break
            case EventStatus.Ended:
                totalVotes = calculateTotalVotesForTrackedParticipations(trackedParticipations)
                break
        }
    }
</script>

<Pane classes="p-6 h-fit shrink-0">
    <Text smaller classes="mb-5">
        {localize('views.governance.details.yourVote.title')}
    </Text>
    <Table
        items={[
            {
                key: localize('views.governance.details.yourVote.total'),
                value: formatTokenAmountBestMatch(totalVotes, metadata),
            },
            {
                key: localize('views.governance.details.yourVote.power'),
                value: formatTokenAmountBestMatch($selectedAccount?.votingPower, metadata),
            },
        ]}
    />
</Pane>
