<script lang="ts">
    import { Activity, ActivityAsyncStatus, ActivityType, InclusionState } from '@core/activity'
    import { time } from '@core/app/stores'
    import { IToken, ITokenWithBalance, NotVerifiedStatus } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
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
    import { getTokenBalance } from '@core/token/actions'

    export let activity: Activity

    let token: IToken | undefined
    $: $selectedAccountTokens,
        (token =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? activity.tokenTransfer?.token ?? activity.baseTokenTransfer.token
                : undefined)
    $: isTimelocked = activity?.asyncData?.timelockDate ? activity?.asyncData?.timelockDate > $time : false
    $: shouldShowAsyncFooter = activity.asyncData && activity.asyncData.asyncStatus !== ActivityAsyncStatus.Claimed

    function onTransactionClick(): void {
        if (token?.verification?.status === NotVerifiedStatus.New) {
            const _token: ITokenWithBalance = {
                ...token,
                balance: getTokenBalance(token.id, activity.sourceNetworkId) ?? {
                    available: 0,
                    total: 0,
                },
            }
            openPopup({
                id: PopupId.TokenInformation,
                overflow: true,
                props: {
                    activityId: activity.id,
                    token: _token,
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
