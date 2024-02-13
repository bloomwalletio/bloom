<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { IProposalsDetails } from '@contexts/governance/interfaces'
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
    import { Text } from '@ui'
    import { FontWeight } from '@ui/enums'
    import { onMount } from 'svelte'
    import { Button } from '@bloomwalletio/ui'

    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }

    $: isOverviewLoaded = !!$participationOverviewForSelectedAccount
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalsDetails()
    $: $selectedAccount, void setParticipationOverview()

    function updateProposalsDetails(): void {
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

<proposals-details class="space-y-4">
    <Text fontSize="14" fontWeight={FontWeight.semibold}>
        {localize('views.governance.proposalsDetails.title')}
    </Text>
    <Table
        items={Object.keys(details).map((key) => ({
            key: localize(`views.governance.proposalsDetails.${key}`),
            value: details[key] ?? 0,
        }))}
    />
    <Button variant="outlined" on:click={onAddProposalClick} width="full" text={localize('actions.addProposal')} />
</proposals-details>
