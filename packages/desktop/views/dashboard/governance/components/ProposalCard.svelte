<script lang="ts">
    import { IconName, Pill, Text, TooltipIcon } from '@bloomwalletio/ui'
    import { IProposal } from '@contexts/governance/interfaces'
    import { participationOverviewForSelectedAccount, selectedProposalId } from '@contexts/governance/stores'
    import { isVotingForProposal } from '@contexts/governance/utils'
    import { localize } from '@core/i18n'
    import { GovernanceRoute, governanceRouter } from '@core/router'
    import { EventStatus } from '@iota/sdk/out/types'
    import { onMount } from 'svelte'
    import { ProposalStatusInfo } from './'
    import { getTimeDifference, milestoneToDate } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { time } from '@core/app/stores'

    export let proposal: IProposal

    let hasVoted = false

    $: $participationOverviewForSelectedAccount, proposal, setHasVoted()

    function setHasVoted(): void {
        hasVoted = isVotingForProposal(proposal?.id)
    }

    function onProposalClick(): void {
        $selectedProposalId = proposal?.id
        $governanceRouter.goTo(GovernanceRoute.Details)
        $governanceRouter.setBreadcrumb(proposal?.title)
    }

    let remainingTime: string
    $: switch (proposal?.status) {
        case EventStatus.Upcoming:
            remainingTime = getTimeDifference(
                milestoneToDate($networkStatus.currentMilestone, proposal?.milestones?.commencing),
                $time
            )
            break
        case EventStatus.Commencing:
            remainingTime = getTimeDifference(
                milestoneToDate($networkStatus.currentMilestone, proposal?.milestones?.holding),
                $time
            )
            break
        case EventStatus.Holding:
            remainingTime = getTimeDifference(
                milestoneToDate($networkStatus.currentMilestone, proposal?.milestones?.ended),
                $time
            )
            break
        default:
            break
    }

    onMount(() => setHasVoted())
</script>

<proposal-card
    on:click={onProposalClick}
    on:keydown={(e) => e.key === 'Enter' && onProposalClick()}
    class="flex flex-col p-6 border border-solid border-gray-200 dark:border-transparent rounded-xl cursor-pointer h-fit shadow-elevation-1 focus:shadow-inner
    {proposal?.status === EventStatus.Ended
        ? 'bg-surface-1 dark:bg-surface-1-dark'
        : 'bg-surface-0 dark:bg-surface-0-dark'}"
>
    <div class="flex items-center gap-1.5 mb-4">
        {#if proposal.organization}
            <TooltipIcon icon={proposal.organization.icon} tooltip={proposal.organization.name} size="sm" />
        {/if}
        <Text truncate>{proposal.title}</Text>
    </div>
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
            <ProposalStatusInfo {proposal} />
            {#if remainingTime}
                <Pill color="neutral">{remainingTime}</Pill>
            {/if}
        </div>
        {#if hasVoted}
            <TooltipIcon
                tooltip={localize('views.governance.proposals.voted')}
                icon={IconName.PackageCheck}
                size="sm"
                placement="left"
                textColor="brand"
            />
        {/if}
    </div>
</proposal-card>
