<script lang="ts">
    import { localize } from '@core/i18n'
    import { IPersistedToken } from '@core/token'
    import { FoundryActivity, getActivityTileTitle } from '@core/activity'
    import { TokenIcon, ActivityTileContent } from '@ui'
    import { getFormattedAmountFromActivity } from '@core/activity/utils/outputs'
    import { getPersistedToken, selectedAccountTokens } from '@core/token/stores'

    export let activity: FoundryActivity

    let token: IPersistedToken | undefined
    $: $selectedAccountTokens, (token = getPersistedToken(activity.tokenId))
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
        <TokenIcon slot="icon" {token} chainId={undefined} />
    </ActivityTileContent>
{/if}
