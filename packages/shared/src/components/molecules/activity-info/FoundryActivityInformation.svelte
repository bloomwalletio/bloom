<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { FoundryActivity } from '@core/activity'
    import { localize } from '@core/i18n'

    export let activity: FoundryActivity
</script>

<Table
    items={[
        {
            key: localize('popups.nativeToken.property.aliasAddress'),
            value: activity.aliasAddress,
            truncate: { firstCharCount: 10, endCharCount: 10 },
            copyable: true,
        },
        {
            key: localize('popups.nativeToken.property.tokenId'),
            value: activity.tokenId,
            truncate: { firstCharCount: 10, endCharCount: 10 },
            copyable: true,
        },
        {
            key: localize('popups.nativeToken.property.maximumSupply'),
            value: String(parseInt(activity.maximumSupply, 16)),
        },
        {
            key: localize('popups.nativeToken.property.mintedTokens'),
            value: String(parseInt(activity.mintedTokens, 16)),
        },
        {
            key: localize('popups.nativeToken.property.meltedTokens'),
            value: String(parseInt(activity.meltedTokens, 16)),
        },
    ]}
/>
