<script lang="ts">
    import { proposalFilter, registeredProposalsForSelectedAccount } from '@contexts/governance/stores'
    import { isVisibleProposal, sortProposals } from '@contexts/governance/utils'
    import { ProposalCard } from './'

    $: proposals = Object.values($registeredProposalsForSelectedAccount)

    const searchTerm = ''

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
    <ul class="grid grid-cols-2 auto-rows-min gap-4 flex-1 overflow-y-scroll pr-3 -mr-5">
        {#each sortedProposals as proposal}
            <ProposalCard {proposal} />
        {/each}
    </ul>
</proposals-container>
