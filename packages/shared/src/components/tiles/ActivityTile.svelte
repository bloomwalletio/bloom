<script lang="ts">
    import { time } from '@core/app'
    import { Activity, ActivityAsyncStatus, ActivityType, InclusionState } from '@core/activity'
    import {
        NotVerifiedStatus,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        IAsset,
    } from '@core/wallet'
    import {
        AliasActivityTileContent,
        AsyncActivityTileFooter,
        ClickableTile,
        ConsolidationActivityTileContent,
        FoundryActivityTileContent,
        GovernanceActivityTileContent,
        NftActivityTileContent,
        TimelockActivityTileFooter,
        TransactionActivityTileContent,
    } from '@ui'
    import { PopupId, openPopup } from '../../../../desktop/lib/auxiliary/popup'

    export let activity: Activity

    let persistedAsset: IPersistedAsset | undefined
    $: $selectedAccountAssets,
        (persistedAsset =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getAssetFromPersistedAssets(activity.assetId)
                : undefined)
    $: isTimelocked = activity?.asyncData?.timelockDate ? activity?.asyncData?.timelockDate > $time : false
    $: shouldShowAsyncFooter = activity.asyncData && activity.asyncData.asyncStatus !== ActivityAsyncStatus.Claimed

    function onTransactionClick(): void {
        if (persistedAsset?.verification?.status === NotVerifiedStatus.New) {
            const asset: IAsset = {
                ...persistedAsset,
                chainId: activity.chainId ?? 0,
                balance: {
                    total: 0,
                    available: 0,
                },
            }
            openPopup({
                id: PopupId.TokenInformation,
                overflow: true,
                props: {
                    activityId: activity.id,
                    asset,
                },
            })
        } else {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId: activity.id },
            })
        }
    }
</script>

<ClickableTile
    onClick={onTransactionClick}
    classes={activity.inclusionState === InclusionState.Pending ? 'opacity-80 animate-pulse' : ''}
>
    <activity-tile class="w-full flex flex-col space-y-4">
        <tile-content class="flex flex-row items-center text-left space-x-4">
            {#if activity.type === ActivityType.Basic}
                <TransactionActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Alias}
                <AliasActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Governance}
                <GovernanceActivityTileContent {activity} />
            {:else if activity.type === ActivityType.Consolidation}
                <ConsolidationActivityTileContent {activity} />
            {:else}
                <FoundryActivityTileContent {activity} />
            {/if}
        </tile-content>
        {#if isTimelocked}
            <TimelockActivityTileFooter {activity} />
        {:else if shouldShowAsyncFooter}
            <AsyncActivityTileFooter {activity} />
        {/if}
    </activity-tile>
</ClickableTile>
