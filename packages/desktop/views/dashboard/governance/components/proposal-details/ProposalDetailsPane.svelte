<script lang="ts">
    import { Icon, IconName, MarkdownBlock, Pill, Text } from '@bloomwalletio/ui'
    import { IProposal } from '@contexts/governance'
    import { time } from '@core/app/stores'
    import { getTimeDifference, milestoneToDate } from '@core/utils'
    import { EventStatus } from '@iota/sdk/out/types'
    import { ProposalDetailsMenu, ProposalStatusPill } from '../'
    import { getL1Network } from '@core/network/stores'

    export let proposal: IProposal

    const currentMilestone = getL1Network().currentMilestone

    let remainingTime: string = ''
    $: switch (proposal?.status) {
        case EventStatus.Upcoming:
            remainingTime = getTimeDifference(
                milestoneToDate($currentMilestone, proposal?.milestones?.commencing),
                $time
            )
            break
        case EventStatus.Commencing:
            remainingTime = getTimeDifference(milestoneToDate($currentMilestone, proposal?.milestones?.holding), $time)
            break
        case EventStatus.Holding:
            remainingTime = getTimeDifference(milestoneToDate($currentMilestone, proposal?.milestones?.ended), $time)
            break
        default:
            remainingTime = ''
            break
    }
</script>

<div class="flex flex-col h-fit">
    <header-container class="flex justify-between items-start mb-4 gap-2">
        <Text type="h6" lineClamp={3}>{proposal?.title}</Text>
        <ProposalDetailsMenu {proposal} />
    </header-container>
    <div class="flex flex-1 flex-col space-y-4 justify-between">
        {#if proposal?.additionalInfo}
            <div class="flex gap-2">
                <additional-info-container class="text-red">
                    <MarkdownBlock text={proposal?.additionalInfo} />
                </additional-info-container>
            </div>
        {/if}
        <div class="flex gap-2">
            <ProposalStatusPill {proposal} />
            {#if remainingTime}
                <Pill color="neutral">
                    <div class="flex flex-row space-x-1 items-center">
                        <Icon size="xxs" customColor="neutral" name={IconName.Clock} />
                        <Text textColor="secondary">{remainingTime}</Text>
                    </div>
                </Pill>
            {/if}
        </div>
    </div>
</div>

<style lang="postcss">
    .truncate-opacity {
        -webkit-mask-image: -webkit-gradient(
            linear,
            left top,
            right top,
            color-stop(80%, rgba(0, 0, 0, 1)),
            color-stop(100%, rgba(0, 0, 0, 0))
        );
    }
</style>
