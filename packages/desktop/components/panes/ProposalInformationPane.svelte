<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { Pane, Text } from '@ui'
    import { Table } from '@bloomwalletio/ui'
    import { selectedProposal } from '@contexts/governance/stores'
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network/stores'
    import { DATE_FORMAT, milestoneToDate, truncateString } from '@core/utils'

    export let classes: string = ''

    interface IProposalDateData {
        propertyKey: 'votingOpens' | 'countingStarts' | 'countingEnds' | 'countingEnded'
        milestone: number
    }

    $: proposalDateData = getNextProposalDateData($selectedProposal?.status)

    function getNextProposalDateData(status: string): IProposalDateData {
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
</script>

<Pane classes="p-6 h-fit {classes}">
    <Text smaller classes="mb-5">
        {localize('views.governance.details.proposalInformation.title')}
    </Text>
    <Table
        items={[
            {
                key: localize(`views.governance.details.proposalInformation.${proposalDateData.propertyKey}`),
                value: proposalDateData?.propertyKey
                    ? formatDate(
                          milestoneToDate($networkStatus.currentMilestone, proposalDateData.milestone),
                          DATE_FORMAT
                      )
                    : undefined,
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
</Pane>
