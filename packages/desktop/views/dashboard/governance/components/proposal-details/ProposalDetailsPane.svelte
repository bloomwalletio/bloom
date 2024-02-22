<script lang="ts">
    import { MarkdownBlock, Text } from '@bloomwalletio/ui'
    import { Pane } from '@ui'
    import { ProposalDetailsMenu, ProposalStatusPill } from '../'
    import { IProposal } from '@contexts/governance'

    export let proposal: IProposal
</script>

<Pane classes="p-6 flex flex-col h-fit">
    <header-container class="flex justify-between items-center mb-4">
        <ProposalStatusPill {proposal} />
        <ProposalDetailsMenu {proposal} modalPosition={{ right: '24px', top: '54px' }} />
    </header-container>
    <div class="flex flex-1 flex-col space-y-4 justify-between scrollable-y">
        <Text type="h4">{proposal?.title}</Text>
        {#if proposal?.additionalInfo}
            <MarkdownBlock text={proposal?.additionalInfo} />
        {/if}
    </div>
</Pane>
