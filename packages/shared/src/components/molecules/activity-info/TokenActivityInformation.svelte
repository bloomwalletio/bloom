<script lang="ts">
    import { IItems, Table } from '@bloomwalletio/ui'
    import { FoundryActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { IIrc30Metadata } from '@core/token'
    import { getPersistedToken } from '@core/token/stores'

    export let activity: FoundryActivity

    let metadata: IIrc30Metadata
    $: metadata = <IIrc30Metadata>getPersistedToken(activity.tokenId)?.metadata

    const items: IItems[] = []
    function setItems(activity: FoundryActivity, metadata: IIrc30Metadata) {
        if (metadata?.name) {
            items.push({
                key: localize('popups.nativeToken.property.tokenName'),
                value: metadata.name,
            })
        }
        if (metadata?.symbol) {
            items.push({
                key: localize('popups.nativeToken.property.unit'),
                value: metadata.symbol,
            })
        }
        items.push({
            key: localize('popups.nativeToken.property.decimals'),
            value: String(metadata.decimals),
        })
        if (metadata?.description) {
            items.push({
                key: localize('popups.nativeToken.property.description'),
                value: metadata.description,
            })
        }
        if (metadata?.url) {
            items.push({
                key: localize('popups.nativeToken.property.url'),
                value: metadata.url,
                copyable: true,
            })
        }
        if (metadata?.logo) {
            items.push({
                key: localize('popups.nativeToken.property.logo'),
                value: metadata.logo,
                copyable: true,
            })
        }
        if (metadata?.logoUrl) {
            items.push({
                key: localize('popups.nativeToken.property.logoUrl'),
                value: metadata.logoUrl,
                copyable: true,
            })
        }
    }
    $: setItems(activity, metadata)
</script>

<Table {items} />
