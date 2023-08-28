<script lang="ts">
    import { type IItems, Table } from '@bloomwalletio/ui'
    import { FoundryActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { IIrc30Metadata } from '@core/token'
    import { getPersistedToken } from '@core/token/stores'

    export let activity: FoundryActivity

    let metadata: IIrc30Metadata
    $: metadata = <IIrc30Metadata>getPersistedToken(activity.tokenId)?.metadata

    let items: IItems[] = []
    function setItems(_metadata: IIrc30Metadata) {
        if (!_metadata) return
        items = []

        if (_metadata?.name) {
            items.push({
                key: localize('popups.nativeToken.property.tokenName'),
                value: _metadata.name,
            })
        }
        if (_metadata?.symbol) {
            items.push({
                key: localize('popups.nativeToken.property.unit'),
                value: _metadata.symbol,
            })
        }
        items.push({
            key: localize('popups.nativeToken.property.decimals'),
            value: String(_metadata.decimals),
        })
        if (_metadata?.description) {
            items.push({
                key: localize('popups.nativeToken.property.description'),
                value: _metadata.description,
            })
        }
        if (_metadata?.url) {
            items.push({
                key: localize('popups.nativeToken.property.url'),
                value: _metadata.url,
                copyable: true,
            })
        }
        if (_metadata?.logo) {
            items.push({
                key: localize('popups.nativeToken.property.logo'),
                value: _metadata.logo,
                copyable: true,
            })
        }
        if (_metadata?.logoUrl) {
            items.push({
                key: localize('popups.nativeToken.property.logoUrl'),
                value: _metadata.logoUrl,
                copyable: true,
            })
        }
    }
    $: activity, setItems(metadata)
</script>

<Table {items} />
