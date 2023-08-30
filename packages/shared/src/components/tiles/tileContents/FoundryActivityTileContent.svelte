<script lang="ts">
    import { localize } from '@core/i18n'
    import { IPersistedToken } from '@core/token'
    import { FoundryActivity, getActivityTileTitle } from '@core/activity'
    import { TokenAvatar, ActivityTileContent } from '@ui'
    import { getFormattedAmountFromActivity } from '@core/activity/utils/outputs'
    import { getPersistedToken, selectedAccountTokens } from '@core/token/stores'
    import { getActiveNetworkId } from '@core/network'

    export let activity: FoundryActivity

    let persistedToken: IPersistedToken | undefined
    $: $selectedAccountTokens, (persistedToken = getPersistedToken(activity.tokenId))
    $: action = localize(getActivityTileTitle(activity))
    $: amount = getFormattedAmountFromActivity(activity)
    $: formattedAsset = {
        text: amount,
        color: 'blue-700',
        classes: 'shrink-0',
    }
</script>

{#if persistedToken}
    <ActivityTileContent {action} subject={localize('general.internalTransaction')} {formattedAsset}>
        <!-- Once the activity contains the chainId, add that here -->
        <TokenAvatar slot="icon" token={{ ...persistedToken, networkId: getActiveNetworkId() }} />
    </ActivityTileContent>
{/if}
