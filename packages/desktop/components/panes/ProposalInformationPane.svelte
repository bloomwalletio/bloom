<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { Pane, Text } from '@ui'
    import { formatDate, localize } from '@core/i18n'
    import { DATE_FORMAT, milestoneToDate, truncateString } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { selectedProposal } from '@contexts/governance/stores'

    export let classes: string = ''

    interface IProposalDateData {
        propertyKey: 'votingOpens' | 'countingStarts' | 'countingEnds' | 'countingEnded'
        milestone: number
    }

    $: proposalDateData = getNextProposalDateData($selectedProposal?.status)

    function getNextProposalDateData(status: string): IProposalDateData {
        switch (status) {
            case ProposalStatus.Upcoming:
                return {
                    propertyKey: 'votingOpens',
                    milestone: $selectedProposal?.milestones?.commencing,
                }
            case ProposalStatus.Commencing:
                return {
                    propertyKey: 'countingStarts',
                    milestone: $selectedProposal?.milestones?.holding,
                }
            case ProposalStatus.Holding:
                return {
                    propertyKey: 'countingEnds',
                    milestone: $selectedProposal?.milestones?.ended,
                }
            case ProposalStatus.Ended:
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
