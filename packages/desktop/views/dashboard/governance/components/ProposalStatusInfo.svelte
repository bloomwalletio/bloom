<script lang="ts">
    import { ProposalStatusPill, ProposalStatusTimelineTooltip } from './'
    import { InformationTooltip } from '@ui'

    import { IProposalWithStatus } from '@contexts/governance/interfaces'
    import { localize } from '@core/i18n'
    import { ProposalError } from '@lib/contexts/governance'

    export let proposal: IProposalWithStatus
    export let placement: 'top' | 'bottom' | 'left' | 'right' = 'right'

    let anchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }

    function handleMouseEnter(): void {
        showTooltip(true)
    }

    function handleMouseLeave(): void {
        showTooltip(false)
    }

    function getProposalErrorText(proposal: IProposalWithStatus): { title: string; body: string } {
        let title: string = ''
        let body: string = ''

        switch (proposal?.error) {
            case ProposalError.NodeOutdated:
                title = localize('tooltips.governance.outdatedNode.title')
                body = localize('tooltips.governance.outdatedNode.body')
                break
            case ProposalError.ResultsNotAvailable:
                title = localize('tooltips.governance.resultsNotAvailable.title')
                body = localize('tooltips.governance.resultsNotAvailable.body')
                break
        }

        return { title, body }
    }
</script>

<div class="flex" bind:this={anchor} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} role="tooltip">
    <ProposalStatusPill {proposal} />
</div>
{#if isTooltipVisible}
    {#if proposal?.error}
        {@const { title, body } = getProposalErrorText(proposal)}
        {#if title && body}
            <InformationTooltip {anchor} {placement} {title} {body} />
        {/if}
    {:else}
        <ProposalStatusTimelineTooltip
            bind:anchor
            milestones={proposal.milestones}
            status={proposal?.status}
            {placement}
        />
    {/if}
{/if}
