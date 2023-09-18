<script lang="ts">
    import { ActivityTileContent, TokenAvatar } from '@ui'
    import {
        ActivityDirection,
        getActivityTileTitle,
        getFormattedAmountFromActivity,
        getSubjectLocaleFromActivity,
        TransactionActivity,
    } from '@core/activity'
    import { localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token/interfaces'
    import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'

    export let activity: TransactionActivity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens,
        (token = getTokenFromSelectedAccountTokens(
            activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId,
            activity.sourceNetworkId
        ))
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
