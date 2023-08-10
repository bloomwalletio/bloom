<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import {
        Activity,
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        getActivityDetailsTitle,
        selectedAccountActivities,
    } from '@core/activity'
    import { getTransactionAssets } from '@core/activity/utils'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { getNftByIdFromAllAccountNfts, ownedNfts, selectedNftId } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { CollectiblesRoute, DashboardRoute, collectiblesRouter, dashboardRouter } from '@core/router'
    import { setClipboard, truncateString } from '@core/utils'
    import { claimActivity, rejectActivity } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import {
        ActivityInformation,
        ActivityStatusPills,
        AliasActivityDetails,
        Button,
        FontWeight,
        Text,
        TextType,
        TransactionAssetSection,
    } from '@ui'
    import { onMount, tick } from 'svelte'

    export let activityId: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: isTimelocked = activity?.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity?.asyncData &&
        (activity?.direction === ActivityDirection.Incoming ||
            activity?.direction === ActivityDirection.SelfTransaction) &&
        activity?.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed
    $: transactionAssets = getTransactionAssets(activity, $selectedAccountIndex)
    $: nft =
        activity.type === ActivityType.Nft
            ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
            : undefined
    $: nftIsOwned = nft ? $ownedNfts.some((_onMountnft) => _onMountnft.id === nft?.id) : false

    let title: string | undefined = localize('popups.activityDetails.title.fallback')
    $: void setTitle(activity)
    async function setTitle(_activity: Activity): Promise<void> {
        title = await getActivityDetailsTitle(_activity)
    }

    async function onNftClick(): Promise<void> {
        closePopup()
        $selectedNftId = nft?.id
        $dashboardRouter.goTo(DashboardRoute.Collectibles)
        await tick()
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }

    function onExplorerClick(): void {
        openUrlInBrowser(`${explorerUrl}/${ExplorerEndpoint.Transaction}/${activity?.transactionId}`)
    }

    function onTransactionIdClick(): void {
        setClipboard(activity?.transactionId)
    }

    async function onClaimClick(): Promise<void> {
        await checkActiveProfileAuth(
            async () => {
                await claimActivity(activity)
                openPopup({
                    id: PopupId.ActivityDetails,
                    props: { activityId },
                })
            },
            { stronghold: true, ledger: false }
        )
    }

    function onRejectClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                hint: localize('actions.confirmRejection.node'),
                info: true,
                confirmText: localize('actions.reject'),
                warning: true,
                onConfirm: () => {
                    rejectActivity(activityId)
                    closePopup()
                },
                onCancel: () =>
                    openPopup({
                        id: PopupId.ActivityDetails,
                        props: { activityId },
                    }),
            },
        })
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            console.error(err)
        }
    })
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <div class="flex flex-col">
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
            {title}
        </Text>
        {#if explorerUrl && activity?.transactionId}
            <button
                class="action w-max flex justify-start text-center font-medium text-14 text-blue-500"
                on:click={onExplorerClick}
            >
                {localize('general.viewOnExplorer')}
            </button>
        {:else if activity?.transactionId}
            <button
                class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                on:click={onTransactionIdClick}
            >
                {truncateString(activity.transactionId, 12, 12)}
            </button>
        {/if}
    </div>
    <activity-details class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
        <ActivityStatusPills {activity} />

        <TransactionAssetSection {...transactionAssets} onNftClick={nftIsOwned ? onNftClick : undefined} />

        {#if activity.type === ActivityType.Alias}
            <AliasActivityDetails {activity} />
        {/if}
        <ActivityInformation {activity} />
    </activity-details>
    {#if !isTimelocked && isActivityIncomingAndUnclaimed}
        <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
            <Button
                outline
                classes="w-full"
                disabled={activity.asyncData?.isClaiming || activity.asyncData?.isRejected}
                onClick={onRejectClick}
            >
                {localize('actions.reject')}
            </Button>
            <Button
                classes="w-full"
                disabled={activity.asyncData?.isClaiming}
                onClick={onClaimClick}
                isBusy={activity.asyncData?.isClaiming}
            >
                {localize('actions.claim')}
            </Button>
        </popup-buttons>
    {/if}
</activity-details-popup>
