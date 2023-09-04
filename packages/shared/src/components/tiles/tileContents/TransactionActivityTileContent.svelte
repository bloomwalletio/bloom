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
    import { getPersistedToken, selectedAccountTokens } from '@core/token/stores'
    import { ActivityTileContent, TokenAvatar } from '@ui'

    export let activity: TransactionActivity

    let persistedToken: IPersistedToken
    $: $selectedAccountTokens, (persistedToken = getPersistedToken(activity.tokenId))
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

{#if persistedToken}
    <ActivityTileContent {action} {subject} {formattedAsset}>
        <TokenAvatar slot="icon" token={{ ...persistedToken, networkId: activity.sourceNetworkId }} />
    </ActivityTileContent>
{/if}
