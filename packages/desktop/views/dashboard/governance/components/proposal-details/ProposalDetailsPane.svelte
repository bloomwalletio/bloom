<script lang="ts">
    import { Button, Icon, IconName, MarkdownBlock, Pill, Text } from '@bloomwalletio/ui'
    import { ProposalDetailsMenu, ProposalStatusPill } from '../'
    import { IProposal } from '@contexts/governance'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { getTimeDifference, milestoneToDate } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { time } from '@core/app/stores'
    import { EventStatus } from '@iota/sdk/out/types'

    const TEXT_LENGTH_TO_TRUNCATE = 40

    export let proposal: IProposal

    function onReadMoreClick(): void {
        openPopup({
            id: PopupId.MarkdownBlock,
            props: {
                title: proposal?.title ?? '',
                markdown: proposal?.additionalInfo,
            },
        })
    }

    let remainingTime: string = ''
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
            remainingTime = ''
            break
    }
</script>

<div class="flex flex-col h-fit px-2">
    <header-container class="flex justify-between items-start mb-4 gap-2">
        <Text type="h5" lineClamp={3}>{proposal?.title}</Text>
        <ProposalDetailsMenu {proposal} />
    </header-container>
    <div class="flex flex-1 flex-col space-y-4 justify-between">
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
        {#if proposal?.additionalInfo}
            {@const truncate = proposal?.additionalInfo.length >= TEXT_LENGTH_TO_TRUNCATE}
            <div class="flex gap-2 whitespace-nowrap">
                <additional-info-container
                    class={truncate ? 'truncate truncate-opacity overflow-hidden text-ellipsis' : ''}
                >
                    <MarkdownBlock text={proposal?.additionalInfo} />
                </additional-info-container>
                {#if truncate}
                    <Button variant="text" on:click={onReadMoreClick} text="Read more" size="sm" />
                {/if}
            </div>
        {/if}
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
