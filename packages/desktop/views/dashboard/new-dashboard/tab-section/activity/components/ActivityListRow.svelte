<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { Activity, ActivityType } from '@core/activity'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { ITokenWithBalance, NotVerifiedStatus } from '@core/token'
    import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import {
        ActivityActionSection,
        ActivityAssetSection,
        ActivityAmountSection,
        ActivityAddressSection,
        ActivityStatusSection,
    } from './row-sections'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens,
        (token =
            activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
                ? getTokenFromSelectedAccountTokens(
                      activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId,
                      activity.sourceNetworkId
                  )
                : undefined)
    $: nft =
        activity.type === ActivityType.Nft
            ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
            : undefined

    function onActivityClick(): void {
        if (token?.verification?.status === NotVerifiedStatus.New) {
            openPopup({
                id: PopupId.TokenInformation,
                overflow: true,
                props: {
                    activityId: activity.id,
                    token,
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

<button on:click={onActivityClick} class="activity-row">
    <div class="flex flex-row gap-4 items-start">
        <ActivityAssetSection {token} {nft} />
    </div>
    <div class="flex flex-row items-start">
        <ActivityStatusSection {activity} />
    </div>
    <div class="flex flex-col items-start">
        <ActivityActionSection {activity} />
    </div>
    <div class="flex flex-col items-start">
        <ActivityAddressSection {activity} />
    </div>
    <div class="flex flex-col items-end">
        <ActivityAmountSection {activity} {token} />
    </div>
</button>

<style lang="scss">
    .activity-row {
        @apply w-full;
        @apply px-5 py-4;
        @apply border-b border-solid border-gray-100;
        @apply hover:bg-gray-50;

        @apply grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
</style>
