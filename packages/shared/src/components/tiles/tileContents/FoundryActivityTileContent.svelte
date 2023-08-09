<script lang="ts">
    import { localize } from '@core/i18n'
    import { getAssetFromPersistedAssets, IPersistedAsset, selectedAccountAssets } from '@core/wallet'
    import { FoundryActivity, getActivityTileTitle } from '@core/activity'
    import { AssetIcon, ActivityTileContent } from '@ui'
    import { getFormattedAmountFromActivity } from '@core/activity/utils/outputs'

    export let activity: FoundryActivity

    let asset: IPersistedAsset | undefined
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.assetId))
    $: action = localize(getActivityTileTitle(activity))
    $: amount = getFormattedAmountFromActivity(activity)
    $: formattedAsset = {
        text: amount,
        color: 'blue-700',
        classes: 'shrink-0',
    }
</script>

{#if asset}
    <ActivityTileContent {action} subject={localize('general.internalTransaction')} {formattedAsset}>
        <!-- Once the activity contains the chainId, add that here -->
        <AssetIcon slot="icon" {asset} chainId={undefined} />
    </ActivityTileContent>
{/if}
