<script lang="ts">
    import { Filter, ProposalCard } from '@components'
    import { SearchInput } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { proposalFilter, registeredProposalsForSelectedAccount } from '@contexts/governance/stores'
    import { isVisibleProposal, sortProposals } from '@contexts/governance/utils'

    $: proposals = Object.values($registeredProposalsForSelectedAccount)

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
    <header-container class="flex justify-between items-center mb-4 h-9">
        <Text type="body2">{localize('views.governance.proposals.title')}</Text>
        <div class="flex flex-row gap-5 items-center">
            <SearchInput bind:value={searchTerm} />
            <Filter filterStore={proposalFilter} />
        </div>
    </header-container>
    <ul class="grid grid-cols-2 auto-rows-min gap-4 flex-1 overflow-y-scroll pr-3 -mr-5">
        {#each sortedProposals as proposal}
            <ProposalCard {proposal} />
        {/each}
    </ul>
</proposals-container>
