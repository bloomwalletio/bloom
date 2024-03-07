<script lang="ts">
    import { Pill, Text } from '@bloomwalletio/ui'
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
        <ProposalList />
    </div>
</governance-dashboard>
