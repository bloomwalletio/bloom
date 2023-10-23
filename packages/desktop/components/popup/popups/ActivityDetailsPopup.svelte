<script lang="ts">
    import { Link } from '@bloomwalletio/ui'
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
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { ownedNfts, selectedNftId } from '@core/nfts/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { CollectiblesRoute, DashboardRoute, collectiblesRouter, dashboardRouter } from '@core/router'
    import { setClipboard, truncateString } from '@core/utils'
    import { claimActivity, rejectActivity } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { ActivityInformation, TransactionAssetSection } from '@ui'
    import { onMount, tick } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let activityId: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

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
    $: explorerUrl = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Transaction)

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
        $collectiblesRouter.setBreadcrumb(nft?.name)
    }

    function onExplorerClick(_activity: Activity): void {
        openUrlInBrowser(`${explorerUrl}/${_activity.transactionId}`)
    }

    function onTransactionIdClick(_activity: Activity): void {
        setClipboard(_activity.transactionId)
    }

    async function onClaimClick(_activity: Activity): Promise<void> {
        await checkActiveProfileAuth(
            async () => {
                await claimActivity(_activity)
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
                variant: 'danger',
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                alert: {
                    variant: 'warning',
                    text: localize('actions.confirmRejection.node'),
                },
                confirmText: localize('actions.reject'),
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

    $: backButton = {
        text: localize('actions.reject'),
        disabled: activity.asyncData?.isRejected,
        onClick: onRejectClick,
    }

    $: continueButton = {
        text: localize('actions.claim'),
        onClick: () => onClaimClick(activity),
    }
</script>

{#if activity}
    <PopupTemplate
        {title}
        busy={activity.asyncData?.isClaiming}
        backButton={isTimelocked || !isActivityIncomingAndUnclaimed ? undefined : backButton}
        continueButton={isTimelocked || !isActivityIncomingAndUnclaimed ? undefined : continueButton}
    >
        <div slot="description" class="flex">
            {#if explorerUrl && activity.transactionId}
                <Link text={localize('general.viewOnExplorer')} external on:click={() => onExplorerClick(activity)} />
            {:else if activity.transactionId}
                <Link
                    text={truncateString(activity.transactionId, 12, 12)}
                    on:click={() => onTransactionIdClick(activity)}
                />
            {/if}
        </div>
        <activity-details class="w-full h-full space-y-5 flex flex-auto flex-col shrink-0">
            <TransactionAssetSection {...transactionAssets} onNftClick={nftIsOwned ? onNftClick : undefined} />
            <ActivityInformation {activity} />
        </activity-details>
    </PopupTemplate>
{/if}
