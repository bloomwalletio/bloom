<script lang="ts">
    import {
        ActivityDirection,
        getActivityTileTitle,
        getFormattedAmountFromActivity,
        getSubjectLocaleFromActivity,
        TransactionActivity,
    } from '@core/activity'
    import { localize } from '@core/i18n'
    import { IToken } from '@core/token/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { ActivityTileContent, TokenAvatar } from '@ui'

    export let activity: TransactionActivity

    let token: IToken
    $: $selectedAccountTokens, (token = activity.tokenTransfer?.token ?? activity.baseTokenTransfer.token)
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

{#if token}
    <ActivityTileContent {action} {subject} {formattedAsset}>
        <TokenAvatar slot="icon" {token} />
    </ActivityTileContent>
{/if}
