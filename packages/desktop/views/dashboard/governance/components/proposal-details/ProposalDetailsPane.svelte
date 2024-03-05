<script lang="ts">
    import { Button, MarkdownBlock, Text } from '@bloomwalletio/ui'
    import { ProposalDetailsMenu, ProposalStatusPill } from '../'
    import { IProposal } from '@contexts/governance'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    const TEXT_LENGTH_TO_TRUNCATE = 40

    export let proposal: IProposal

    function onReadMoreClick(): void {
        openPopup({
            id: PopupId.MarkdownBlock,
            props: {
                title: proposal?.title ?? '',
                markdown: proposal?.additionalInfo,
            },
            hideClose: true,
        })
    }
</script>

<div class="flex flex-col h-fit">
    <header-container class="flex justify-between items-start mb-4">
        <Text type="h5">{proposal?.title}</Text>
        <ProposalDetailsMenu {proposal} modalPosition={{ right: '24px', top: '54px' }} />
    </header-container>
    <div class="flex flex-1 flex-col space-y-4 justify-between">
        <div class="flex">
            <ProposalStatusPill {proposal} />
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
