<script lang="ts">
    import {
        ActivityDirection,
        getActivityTileTitle,
        getFormattedAmountFromActivity,
        getSubjectLocaleFromActivity,
        TransactionActivity,
    } from '@core/activity'
    import { localize } from '@core/i18n'
    import { IPersistedToken } from '@core/token'
    import { getPersistedAsset, selectedAccountTokens } from '@core/token/stores'
    import { ActivityTileContent, TokenIcon } from '@ui'

    export let activity: TransactionActivity

    let token: IPersistedToken
    $: $selectedAccountTokens, (token = getPersistedAsset(activity.assetId))
    $: action = localize(getActivityTileTitle(activity))
    $: subject =
        activity.direction === ActivityDirection.SelfTransaction
            ? localize('general.internalTransaction')
            : localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                  values: { account: getSubjectLocaleFromActivity(activity) },
              })

    $: amount = getFormattedAmountFromActivity(activity)
    $: isIncoming = activity.direction === ActivityDirection.Incoming
    $: formattedAsset = {
        text: amount,
        color: isIncoming || activity.direction === ActivityDirection.SelfTransaction ? 'blue-700' : '',
        classes: 'shrink-0',
    }
</script>

{#if asset}
    <ActivityTileContent {action} {subject} {formattedAsset}>
        <TokenIcon slot="icon" {token} chainId={activity.chainId} />
    </ActivityTileContent>
{/if}
