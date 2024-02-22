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
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import { Button, Text } from '@bloomwalletio/ui'

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

    function onAddProposalClick(): void {
        openPopup({
            id: PopupId.AddProposal,
            overflow: true,
        })
    }

    onMount(setParticipationOverview)
</script>

<proposal-list-details class="space-y-6">
    <Text type="body2">
        {localize('views.governance.proposalsDetails.title')}
    </Text>
    <Table
        items={Object.keys(details).map((key) => ({
            key: localize(`views.governance.proposalsDetails.${key}`),
            value: details[key] ?? 0,
        }))}
    />
    <Button variant="outlined" on:click={onAddProposalClick} width="full" text={localize('actions.addProposal')} />
</proposal-list-details>
