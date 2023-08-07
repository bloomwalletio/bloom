<script lang="ts">
    import { getTransactionAssets } from '@core/activities/utils'
    import { closePopup } from '../../../../desktop/lib/auxiliary/popup'
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { ownedNfts, selectedNftId } from '@core/nfts'
    import { CollectiblesRoute, collectiblesRouter, DashboardRoute, dashboardRouter } from '@core/router'
    import { ActivityAsyncStatus, NftActivity } from '@core/wallet'
    import { getSubjectFromActivity } from '@core/wallet/utils/generateActivity/helper'
    import {
        ActivityAsyncStatusPill,
        Pill,
        SubjectBox,
        TransactionActivityStatusPill,
        TransactionAssetSection,
    } from '@ui'
    import { tick } from 'svelte'

    export let activity: NftActivity

    $: nftIsOwned = $ownedNfts.some((nft) => nft.id === activity.nftId)
    $: isTimelocked = activity?.asyncData?.timelockDate > $time
    $: subject = getSubjectFromActivity(activity)
    $: transactionAssets = getTransactionAssets(activity, $selectedAccountIndex)

    async function onClick(): Promise<void> {
        closePopup()
        $selectedNftId = activity.nftId
        $dashboardRouter.goTo(DashboardRoute.Collectibles)
        await tick()
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<nft-transaction-details class="w-full space-y-6 flex flex-auto flex-col shrink-0">
    <TransactionAssetSection {...transactionAssets} onNftClick={nftIsOwned ? onClick : undefined} />

    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3 overflow-hidden">
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if activity?.inclusionState && activity?.direction}
                <TransactionActivityStatusPill
                    type={activity.type}
                    action={activity?.action}
                    direction={activity?.direction}
                    isInternal={activity?.isInternal}
                    inclusionState={activity?.inclusionState}
                />
            {/if}
            {#if activity?.asyncData?.asyncStatus && activity?.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked}
                <ActivityAsyncStatusPill asyncStatus={activity?.asyncData?.asyncStatus} />
            {/if}
            {#if isTimelocked}
                <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                    {localize('pills.locked')}
                </Pill>
            {/if}
        </transaction-status>
        {#if activity?.subject}
            <SubjectBox {subject} />
        {/if}
    </main-content>
</nft-transaction-details>
