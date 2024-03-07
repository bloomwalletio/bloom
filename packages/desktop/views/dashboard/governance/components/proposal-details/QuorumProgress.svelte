<script lang="ts">
    import {
        IProposal,
        getCirculatingSupplyVotedPercentage,
        selectedParticipationEventStatus,
    } from '@contexts/governance'
    import { Text, Progress } from '@bloomwalletio/ui'

    export let proposal: IProposal

    const QUORUM_PERCENTAGE_DECIMAL = 0.05

    $: circulatingSupplyVotedPercentage = getCirculatingSupplyVotedPercentage(
        $selectedParticipationEventStatus,
        proposal
    )
</script>

<div class="flex flex-col gap-1 px-2">
    <div class="flex justify-between gap-1">
        <Text align="center">Quorum progress</Text>
        <div class="flex gap-1">
            <Text align="center" fontWeight="medium" textColor="brand"
                >{circulatingSupplyVotedPercentage} / {QUORUM_PERCENTAGE_DECIMAL * 100}%</Text
            >
        </div>
    </div>
    <Progress
        size="sm"
        progress={Number(circulatingSupplyVotedPercentage.replace('%', '').replace(',', '.')) /
            QUORUM_PERCENTAGE_DECIMAL}
    />
</div>
