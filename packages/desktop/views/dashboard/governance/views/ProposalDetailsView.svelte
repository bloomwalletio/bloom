<script lang="ts">
    import {
        clearParticipationEventStatusPoll,
        pollParticipationEventStatus,
    } from '@contexts/governance/actions/pollParticipationEventStatus'
    import {
        clearSelectedParticipationEventStatus,
        selectedProposal,
        updateParticipationOverviewForEventId,
    } from '@contexts/governance/stores'
    import { onDestroy, onMount } from 'svelte'
    import {
        ProjectionTogglePane,
        ProposalAccountVotingPane,
        ProposalDetailsPane,
        ProposalInformationPane,
        ProposalQuestionListPane,
    } from '../components/proposal-details'
    import { EventStatus } from '@iota/sdk/out/types'
    import { Pane } from '@ui'

    let statusLoaded: boolean = false
    let overviewLoaded: boolean = false
    let isProjectionEnabled: boolean = false

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
        {#if $selectedProposal.status === EventStatus.Holding}
            <ProjectionTogglePane bind:checked={isProjectionEnabled} />
        {/if}
        <ProposalAccountVotingPane />
        <ProposalInformationPane />
    </div>
    <ProposalQuestionListPane {statusLoaded} {overviewLoaded} projected={isProjectionEnabled} />
</Pane>
