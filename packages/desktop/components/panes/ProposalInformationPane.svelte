<script lang="ts">
    import { Pane, Text } from '@ui'
    import { Table } from '@bloomwalletio/ui'
    import { formatDate, localize } from '@core/i18n'
    import { DATE_FORMAT, IKeyValueBoxList, milestoneToDate, truncateString } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { selectedProposal } from '@contexts/governance/stores'

    export let classes: string = ''

    let items: { key: string; value: string }[]

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

    let proposalInformation: IKeyValueBoxList
    $: proposalInformation = {
        ...(proposalDateData?.propertyKey && {
            [proposalDateData.propertyKey]: {
                data: formatDate(
                    milestoneToDate($networkStatus.currentMilestone, proposalDateData.milestone),
                    DATE_FORMAT
                ),
            },
        }),
        eventId: {
            data: truncateString($selectedProposal?.id, 9, 9),
            isCopyable: true,
            copyValue: $selectedProposal?.id,
        },
        nodeUrl: { data: $selectedProposal?.nodeUrl, isCopyable: true },
    }

    $: items, setProposalDetailValues()

    function setProposalDetailValues(): void {
        items = []
        for (const key in proposalInformation) {
            items.push({
                key: localize(`views.governance.details.proposalInformation.${key}`),
                value: proposalInformation[key]?.data,
                copyable: {
                    popover: {
                        content: localize('general.copiedToClipboard'),
                    },
                },
            })
        }
    }
</script>

<Pane classes="p-6 h-fit {classes}">
    <Text smaller classes="mb-5">
        {localize('views.governance.details.proposalInformation.title')}
    </Text>
    <Table {items} />
</Pane>
