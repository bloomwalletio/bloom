<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { FoundryActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { IIrc30Metadata } from '@core/token'
    import { getPersistedToken } from '@core/token/stores'

    export let activity: FoundryActivity

    let metadata: IIrc30Metadata | undefined
    $: metadata = <IIrc30Metadata>(
        getPersistedToken(activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId)?.metadata
    )
</script>

{#if metadata}
    <Table
        items={[
            {
                key: localize('popups.nativeToken.property.tokenName'),
                value: metadata.name || undefined,
            },
            {
                key: localize('popups.nativeToken.property.unit'),
                value: metadata.symbol || undefined,
            },
            {
                key: localize('popups.nativeToken.property.decimals'),
                value: String(metadata.decimals) || undefined,
            },
            {
                key: localize('popups.nativeToken.property.description'),
                value: metadata.description || undefined,
            },
            {
                key: localize('popups.nativeToken.property.url'),
                value: metadata.url || undefined,
                copyable: true,
            },
            {
                key: localize('popups.nativeToken.property.logo'),
                value: metadata.logo || undefined,
                copyable: true,
            },
            {
                key: localize('popups.nativeToken.property.logoUrl'),
                value: metadata.logoUrl || undefined,
                copyable: true,
            },
        ]}
    />
{/if}
