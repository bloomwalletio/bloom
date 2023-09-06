<script lang="ts">
    import { localize } from '@core/i18n'
    import { IToken } from '@core/token'
    import { FoundryActivity, getActivityTileTitle } from '@core/activity'
    import { TokenAvatar, ActivityTileContent } from '@ui'
    import { getFormattedAmountFromActivity } from '@core/activity/utils/outputs'
    import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'

    export let activity: FoundryActivity

    let token: IToken | undefined
    $: $selectedAccountTokens,
        (token = getTokenFromSelectedAccountTokens(
            activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId,
            activity.sourceNetworkId
        ))
    $: action = localize(getActivityTileTitle(activity))
    $: amount = getFormattedAmountFromActivity(activity)
    $: formattedAsset = {
        text: amount,
        color: 'blue-700',
        classes: 'shrink-0',
    }
</script>

{#if token}
    <ActivityTileContent {action} subject={localize('general.internalTransaction')} {formattedAsset}>
        <!-- Once the activity contains the chainId, add that here -->
        <TokenAvatar slot="icon" {token} />
    </ActivityTileContent>
{/if}
