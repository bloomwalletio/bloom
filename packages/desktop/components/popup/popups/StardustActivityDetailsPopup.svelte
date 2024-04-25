<script lang="ts">
    import { Link } from '@bloomwalletio/ui'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import {
        ActivityDirection,
        StardustActivity,
        StardustActivityAsyncStatus,
        StardustActivityType,
        getActivityDetailsTitle,
    } from '@core/activity'
    import { getTransactionAssets } from '@core/activity/utils'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint } from '@core/network'
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { ownedNfts, selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, DashboardRoute, collectiblesRouter, dashboardRouter } from '@core/router'
    import { buildUrl, setClipboard, truncateString } from '@core/utils'
    import { claimActivity, rejectActivity } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { StardustActivityInformation, TransactionAssetSection } from '@ui'
    import { tick } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let activity: StardustActivity

    $: isTimelocked = activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.asyncData &&
        (activity.direction === ActivityDirection.Incoming ||
            activity.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Unclaimed
    $: transactionAssets = getTransactionAssets(activity, $selectedAccountIndex)
    $: nft =
        activity.type === StardustActivityType.Nft
            ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
            : undefined
    $: nftIsOwned = nft ? $ownedNfts.some((_nft) => _nft.id === nft?.id) : false

    let title: string = localize('popups.activityDetails.title.fallback')
    $: void setTitle(activity)
    async function setTitle(_activity: StardustActivity | undefined): Promise<void> {
        if (_activity) {
            title = await getActivityDetailsTitle(_activity)
        }
    }

    $: explorerUrl = getExplorerUrl(activity)
    function getExplorerUrl(_activity: StardustActivity): string | undefined {
        if (activity?.direction === ActivityDirection.Genesis) {
            const { baseUrl, endpoint } = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Output)
            const url = buildUrl({ origin: baseUrl, pathname: `${endpoint}/${_activity?.outputId}` })
            return url?.href
        } else {
            const { baseUrl, endpoint } = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Transaction)
            const url = buildUrl({ origin: baseUrl, pathname: `${endpoint}/${_activity?.transactionId}` })
            return url?.href
        }
    }

    async function onNftClick(): Promise<void> {
        closePopup()
        $selectedNftId = nft?.id
        $dashboardRouter?.goTo(DashboardRoute.Collectibles)
        await tick()
        $collectiblesRouter?.goTo(CollectiblesRoute.Details)
        $collectiblesRouter?.setBreadcrumb(nft?.name)
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
                    rejectActivity(activity.id)
                    closePopup()
                },
                onCancel: () =>
                    openPopup({
                        id: PopupId.ActivityDetails,
                        props: { activityId: activity.id },
                    }),
            },
        })
    }

    $: backButton = {
        text: localize('actions.reject'),
        disabled: activity.asyncData?.isRejected,
        onClick: onRejectClick,
    }

    $: continueButton = {
        text: localize('actions.claim'),
        onClick: () => claimActivity(activity, $selectedAccount),
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
                <Link
                    text={localize('general.viewOnExplorer')}
                    external
                    on:click={() => openUrlInBrowser(explorerUrl)}
                />
            {:else if activity.transactionId}
                <Link
                    text={truncateString(activity.transactionId, 12, 12)}
                    on:click={() => setClipboard(activity.transactionId ?? '')}
                />
            {/if}
        </div>
        <activity-details class="w-full h-full space-y-5 flex flex-auto flex-col shrink-0">
            <TransactionAssetSection {...transactionAssets} onNftClick={nftIsOwned ? onNftClick : undefined} />
            <StardustActivityInformation {activity} />
        </activity-details>
    </PopupTemplate>
{/if}
