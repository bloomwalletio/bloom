<script lang="ts">
    import {
        clearParticipationEventStatusPoll,
        pollParticipationEventStatus,
    } from '@contexts/governance/actions/pollParticipationEventStatus'
    import {
        clearSelectedParticipationEventStatus,
        selectedParticipationEventStatus,
        selectedProposal,
        updateParticipationOverviewForEventId,
    } from '@contexts/governance/stores'
    import { Pane } from '@ui'
    import { onDestroy, onMount } from 'svelte'
    import {
        ProposalAccountVotingPane,
        ProposalDetailsPane,
        ProposalInformationPane,
        ProposalQuestionListPane,
    } from '../components/proposal-details'
    import { Text, Progress } from '@bloomwalletio/ui'
    import { getCirculatingSupplyVotedPercentage } from '@contexts/governance/utils'

    let statusLoaded: boolean = false
    let overviewLoaded: boolean = false

    $: circulatingSupplyVotedPercentage = getCirculatingSupplyVotedPercentage(
        $selectedParticipationEventStatus,
        $selectedProposal
    )
    onMount(() => {
        // Callbacks used, because we don't want to await the resolution of the promises.
        pollParticipationEventStatus($selectedProposal?.id)
            .then(() => (statusLoaded = true))
            .catch()
        updateParticipationOverviewForEventId($selectedProposal?.id)
            .then(() => (overviewLoaded = true))
            .catch()
    })

    onDestroy(() => {
        clearParticipationEventStatusPoll()
        clearSelectedParticipationEventStatus()
    })
</script>

<Pane
    classes="w-full h-full flex flex-nowrap relative flex-1 divide-x divide-solid divide-stroke dark:divide-stroke-dark"
>
    <div class="w-2/5 flex flex-col p-6 space-y-6 relative overflow-y-scroll">
        <ProposalDetailsPane proposal={$selectedProposal} />
        <div class="flex flex-col gap-1">
            <div class="flex justify-between gap-1">
                <Text align="center">Circulating supply voted</Text>
                <Text align="center" fontWeight="medium" textColor="brand">{circulatingSupplyVotedPercentage}</Text>
            </div>
            <Progress
                size="sm"
                progress={Number(circulatingSupplyVotedPercentage.replace('%', '').replace(',', '.'))}
            />
        </div>
        <ProposalAccountVotingPane />
        <ProposalInformationPane />
    </div>
    <ProposalQuestionListPane {statusLoaded} {overviewLoaded} />
</Pane>
