<script lang="ts">
    import { EmptyListPlaceholder, Filter } from '@components'
    import { IconName } from '@bloomwalletio/ui'
    import { proposalFilter, registeredProposalsForSelectedAccount } from '@contexts/governance/stores'
    import { getProposalsWithStatus, isVisibleProposal, sortProposals } from '@contexts/governance/utils'
    import { SearchInput } from '@ui'
    import { ProposalCard } from './'
    import ProposalListMenu from './ProposalListMenu.svelte'
    import { localize } from '@core/i18n'
    import { getL1Network } from '@core/network'

    const { currentMilestone } = getL1Network()
    $: proposals = getProposalsWithStatus($registeredProposalsForSelectedAccount, $currentMilestone)

    let searchTerm = ''

    $: visibleProposals = proposals
        .filter((proposal) => isVisibleProposal(proposal, $proposalFilter))
        .filter((proposal) => {
            if (!searchTerm) {
                return true
            } else if (
                proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proposal.id.includes(searchTerm.toLowerCase())
            ) {
                return true
            }
            return false
        })
        .sort((a, b) => (a.id < b.id ? -1 : 1))
    $: sortedProposals = sortProposals(visibleProposals, $proposalFilter)
</script>

<proposals-container class="flex flex-col h-full">
    <header-container class="flex justify-end items-center mb-4 h-10 shrink-0">
        <div class="flex flex-row gap-5 items-center">
            <SearchInput bind:value={searchTerm} />
            <Filter filterStore={proposalFilter} />
            <ProposalListMenu />
        </div>
    </header-container>
    {#if sortedProposals.length}
        <ul class="grid grid-cols-2 auto-rows-min gap-4 flex-1 overflow-y-scroll pr-3 -mr-5">
            {#each sortedProposals as proposal}
                <ProposalCard {proposal} />
            {/each}
        </ul>
    {:else}
        <div class="w-full h-full flex flex-col items-center justify-center">
            <EmptyListPlaceholder
                title={localize('views.governance.proposals.emptyTitle')}
                subtitle={localize('views.governance.proposals.emptyDescription')}
                icon={IconName.BookmarkX}
            />
        </div>
    {/if}
</proposals-container>
