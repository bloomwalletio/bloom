<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { EmptyListPlaceholder, ProposalListDetails } from '@components'
    import { Pane } from '@ui'
    import { ManageVotingPowerPane } from '../components'
    import { localize } from '@core/i18n'
    import { registeredProposalsForSelectedAccount } from '@contexts/governance/stores'
    import { ProposalList } from '@views/governance'
</script>

<governance-dashboard class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-6">
    <div class="w-1/3 flex flex-col space-y-4">
        <ManageVotingPowerPane />
        <Pane classes="p-6 h-fit">
            <ProposalListDetails />
        </Pane>
    </div>
    <div class="w-2/3">
        {#if Object.keys($registeredProposalsForSelectedAccount).length}
            <ProposalList />
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center">
                <EmptyListPlaceholder
                    title={localize('views.governance.proposals.emptyTitle')}
                    subtitle={localize('views.governance.proposals.emptyDescription')}
                    icon={IconName.BookmarkX}
                />
            </div>
        {/if}
    </div>
</governance-dashboard>
