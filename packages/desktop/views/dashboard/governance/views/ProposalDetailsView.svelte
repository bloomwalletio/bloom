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
    import { Pane } from '@ui'
    import { onDestroy, onMount } from 'svelte'
    import {
        ProposalDetailsPane,
        ProposalInformationPane,
        ProposalQuestionListPane,
        QuorumProgress,
    } from '../components/proposal-details'
    import { getL1Network } from '@core/network'
    import { getProposalWithStatus } from '@contexts/governance/utils'

    let statusLoaded: boolean = false
    let overviewLoaded: boolean = false
    let projected: boolean = false

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

    const { currentMilestone } = getL1Network()
    $: proposal = getProposalWithStatus($selectedProposal, $currentMilestone)
</script>

<Pane
    classes="w-full h-full flex flex-nowrap relative flex-1 divide-x divide-solid divide-stroke dark:divide-stroke-dark"
>
    <div class="w-2/5 flex flex-col p-6 space-y-6 relative overflow-y-scroll">
        <ProposalDetailsPane {proposal} />
        <QuorumProgress {proposal} {projected} />
        <ProposalInformationPane />
    </div>
    <ProposalQuestionListPane bind:projected {statusLoaded} {overviewLoaded} />
</Pane>
