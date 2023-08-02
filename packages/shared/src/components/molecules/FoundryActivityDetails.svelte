<script lang="ts">
    import { SubjectBox, TokenAmountTile, TransactionActivityStatusPill } from '@ui'
    import { getAssetById } from '@core/wallet'
    import { FoundryActivity } from '@core/wallet'
    import { network } from '@core/network'

    export let activity: FoundryActivity

    $: asset = getAssetById(activity.assetId, $network?.getMetadata().id as string)
    $: amount = activity.rawAmount
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-6">
    {#if asset}
        <TokenAmountTile {asset} {amount} />
    {/if}
    <div class="flex flex-col space-y-3">
        <foundry-status class="flex flex-row w-full space-x-2 justify-center">
            <TransactionActivityStatusPill
                type={activity.type}
                inclusionState={activity.inclusionState}
                direction={activity.direction}
                isInternal={activity.isInternal}
                action={activity.action}
            />
        </foundry-status>
        {#if activity?.subject}
            <SubjectBox subject={activity.subject} />
        {/if}
    </div>
</main-content>
