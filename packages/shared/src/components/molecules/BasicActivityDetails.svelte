<script lang="ts">
    import {
        TransactionActivityStatusPill,
        ActivityAsyncStatusPill,
        Pill,
        SubjectBox,
        TransactionAssetSection,
    } from '@ui'
    import { localize } from '@core/i18n'
    import { TransactionActivity, ActivityAsyncStatus, getAssetById, TokenTransferData } from '@core/wallet'
    import { time } from '@core/app'
    import { getSubjectFromActivity } from '@core/wallet/utils/generateActivity/helper'
    import { getCoinType } from '@core/profile'

    export let activity: TransactionActivity

    $: asset = getAssetById(activity.assetId, activity.networkId)
    $: isTimelocked = activity.asyncData?.timelockDate > $time
    $: subject = getSubjectFromActivity(activity)
    $: transactionAssets = getTransactionAssets(activity)

    function getTransactionAssets(_activity: TransactionActivity): {
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        if (_activity.assetId === getCoinType()) {
            return {
                baseCoinTransfer: {
                    rawAmount: String(_activity.rawBaseCoinAmount),
                    asset,
                },
            }
        } else {
            const baseCoin = getAssetById(getCoinType(), activity.networkId)
            return {
                tokenTransfer: {
                    rawAmount: String(_activity.rawAmount),
                    asset,
                },
                baseCoinTransfer: {
                    rawAmount: String((_activity.rawBaseCoinAmount ?? 0) - _activity.storageDeposit),
                    asset: baseCoin,
                },
            }
        }
    }
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-6">
    <TransactionAssetSection {...transactionAssets} />

    <div class="flex flex-col space-y-3">
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if activity.inclusionState && activity.direction}
                <TransactionActivityStatusPill
                    type={activity.type}
                    direction={activity.direction}
                    action={activity.action}
                    isInternal={activity.isInternal}
                    inclusionState={activity.inclusionState}
                />
            {/if}
            {#if activity.asyncData?.asyncStatus && activity?.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked}
                <ActivityAsyncStatusPill asyncStatus={activity.asyncData.asyncStatus} />
            {/if}
            {#if isTimelocked}
                <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                    {localize('pills.locked')}
                </Pill>
            {/if}
            {#if activity?.parsedLayer2Metadata}
                <Pill backgroundColor="blue-200" darkBackgroundColor="blue-200">
                    {localize('pills.smartContract')}
                </Pill>
            {/if}
        </transaction-status>
        {#if activity?.subject}
            <SubjectBox {subject} />
        {/if}
    </div>
</main-content>
