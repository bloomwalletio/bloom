<script lang="ts">
    import { selectedAccountIndex } from '@core/account'
    import { ActivityAsyncStatus } from '@core/activities/enums'
    import { TransactionActivity } from '@core/activities/types'
    import { getSubjectFromActivity, getTransactionAssets } from '@core/activities/utils'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        ActivityAsyncStatusPill,
        Pill,
        SubjectBox,
        TransactionActivityStatusPill,
        TransactionAssetSection,
    } from '@ui'

    export let activity: TransactionActivity

    $: isTimelocked = activity.asyncData?.timelockDate && activity.asyncData?.timelockDate > $time
    $: subject = getSubjectFromActivity(activity)
    $: transactionAssets = getTransactionAssets(activity, $selectedAccountIndex)
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
