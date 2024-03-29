<script lang="ts">
    import { Table, Text } from '@bloomwalletio/ui'
    import {
        participationOverviewForSelectedAccount,
        selectedParticipationEventStatus,
        selectedProposal,
    } from '@contexts/governance/stores'
    import { calculateTotalVotesForTrackedParticipations } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network/stores'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { DATE_FORMAT, milestoneToDate, truncateString } from '@core/utils'
    import { EventStatus } from '@iota/sdk/out/types'

    interface IProposalDateData {
        propertyKey: 'votingOpens' | 'countingStarts' | 'countingEnds' | 'countingEnded'
        milestone: number
    }

    $: proposalDateData = getNextProposalDateData($selectedProposal?.status)

    function getNextProposalDateData(status: EventStatus): IProposalDateData {
        switch (status) {
            case EventStatus.Upcoming:
                return {
                    propertyKey: 'votingOpens',
                    milestone: $selectedProposal?.milestones?.commencing,
                }
            case EventStatus.Commencing:
                return {
                    propertyKey: 'countingStarts',
                    milestone: $selectedProposal?.milestones?.holding,
                }
            case EventStatus.Holding:
                return {
                    propertyKey: 'countingEnds',
                    milestone: $selectedProposal?.milestones?.ended,
                }
            case EventStatus.Ended:
                return {
                    propertyKey: 'countingEnded',
                    milestone: $selectedProposal?.milestones?.ended,
                }
            default:
                return undefined
        }
    }

    const { metadata } = $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin ?? {}

    let totalVotes = BigInt(0)

    $: selectedProposalOverview = $participationOverviewForSelectedAccount?.participations?.[$selectedProposal?.id]
    $: trackedParticipations = Object.values(selectedProposalOverview ?? {})
    $: currentMilestone = $networkStatus.currentMilestone

    // Reactively start updating votes once component has mounted and participation overview is available.
    $: $selectedParticipationEventStatus && trackedParticipations && currentMilestone && setTotalVotes()

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

<div class="h-fit shrink-0 space-y-4">
    <Text type="body2">{localize('views.governance.details.proposalInformation.title')}</Text>
    <Table
        items={[
            {
                key: localize(`views.governance.details.proposalInformation.${proposalDateData?.propertyKey}`),
                value: proposalDateData?.propertyKey
                    ? formatDate(
                          milestoneToDate($networkStatus.currentMilestone, proposalDateData.milestone),
                          DATE_FORMAT
                      )
                    : undefined,
            },
            {
                key: localize('views.governance.details.yourVote.power'),
                value: formatTokenAmountBestMatch($selectedAccount?.votingPower, metadata),
            },
            {
                key: localize('views.governance.details.yourVote.total'),
                value: formatTokenAmountBestMatch(totalVotes, metadata),
            },
            {
                key: localize('views.governance.details.proposalInformation.eventId'),
                value: truncateString($selectedProposal?.id, 9, 9),
                copyable: true,
            },
            {
                key: localize('views.governance.details.proposalInformation.nodeUrl'),
                value: $selectedProposal?.nodeUrl,
                copyable: true,
            },
        ]}
    />
</div>
