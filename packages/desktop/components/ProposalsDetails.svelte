<script lang="ts">
    import { onMount } from 'svelte'

    import { Button, Text, ProposalsDetailsButton } from '@ui'
    import { ButtonSize, FontWeight } from '@ui/enums'
    import { Table } from '@bloomwalletio/ui'

    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'

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

    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }

    let items: { key: string; value: string }[]

    $: isOverviewLoaded = !!$participationOverviewForSelectedAccount
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalsDetails()
    $: $selectedAccount, void setParticipationOverview()
    $: items, setProposalDetailValues()

    function setProposalDetailValues(): void {
        items = []
        for (const key in details) {
            items.push({
                key: localize(`views.governance.proposalsDetails.${key}`),
                value: details[key] ?? 0,
            })
        }
    }

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
    <header-container class="flex justify-between items-center relative">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposalsDetails.title')}
        </Text>
        <ProposalsDetailsButton modalPosition={{ right: '0px', top: '34px' }} />
    </header-container>
    <Table {items} />
    <Button size={ButtonSize.Medium} outline onClick={onAddProposalClick} classes="w-full">
        {localize('actions.addProposal')}
    </Button>
</proposals-details>
