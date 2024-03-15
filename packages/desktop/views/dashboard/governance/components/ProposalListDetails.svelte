<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { IProposalListDetails } from '@contexts/governance/interfaces'
    import {
        participationOverviewForSelectedAccount,
        registeredProposalsForSelectedAccount,
        updateParticipationOverview,
    } from '@contexts/governance/stores'
    import {
        getNumberOfActiveProposals,
        getNumberOfTotalProposals,
        getNumberOfVotedProposals,
        getNumberOfVotingProposals,
    } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile/stores'
    import { onMount } from 'svelte'

    let details = <IProposalListDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }

    $: isOverviewLoaded = !!$participationOverviewForSelectedAccount
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalListDetails()
    $: $selectedAccount, void setParticipationOverview()

    function updateProposalListDetails(): void {
        if ($activeProfileId) {
            details = {
                totalProposals: getNumberOfTotalProposals(),
                activeProposals: getNumberOfActiveProposals(),
                votingProposals: getNumberOfVotingProposals(),
                votedProposals: getNumberOfVotedProposals(),
            }
        }
    }

    async function setParticipationOverview(): Promise<void> {
        if (!isOverviewLoaded || getNumberOfVotedProposals() === 0) {
            await updateParticipationOverview($selectedAccount.index)
        }
    }

    onMount(setParticipationOverview)
</script>

<Table
    items={Object.keys(details).map((key) => ({
        key: localize(`views.governance.proposalsDetails.${key}`),
        value: details[key] ?? 0,
    }))}
/>
