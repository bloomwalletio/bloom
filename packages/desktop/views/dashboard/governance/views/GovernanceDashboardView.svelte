<script lang="ts">
    import { IconName, Pill, Text } from '@bloomwalletio/ui'
    import { EmptyListPlaceholder } from '@components'
    import { registeredProposalsForSelectedAccount } from '@contexts/governance/stores'
    import { localize } from '@core/i18n'
    import { ManageVotingPowerPane, ProposalList, ProposalListDetails } from '../components'
</script>

<governance-dashboard class="w-full h-full flex flex-nowrap relative flex-1 space-x-6">
    <div class="w-1/3 flex flex-col space-y-4">
        <div class="flex gap-2 pt-2">
            <Text type="h6">{localize('views.governance.proposals.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">
                    {String(Object.keys($registeredProposalsForSelectedAccount).length ?? '')}
                </Text>
            </Pill>
        </div>
        <ManageVotingPowerPane />
        <ProposalListDetails />
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
