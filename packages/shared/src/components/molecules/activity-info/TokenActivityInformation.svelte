<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { IIrc30Metadata } from '@core/token'
    import { IKeyValueBoxList } from '@core/utils'
    import { getPersistedToken } from '@core/token/stores'
    import { FoundryActivity } from '@core/activity'

    export let activity: FoundryActivity

    let metadata: IIrc30Metadata
    $: metadata = <IIrc30Metadata>getPersistedToken(activity.assetId)?.metadata

    let detailsList: IKeyValueBoxList
    $: detailsList = {
        ...(metadata?.name && {
            tokenName: { data: metadata.name },
        }),
        ...(metadata?.symbol && {
            unit: { data: metadata.symbol },
        }),
        decimals: { data: String(metadata.decimals) },
        ...(metadata?.description && {
            description: { data: metadata.description },
        }),
        ...(metadata?.url && {
            url: { data: metadata.url, isCopyable: true },
        }),
        ...(metadata?.logo && {
            logo: { data: metadata.logo, isCopyable: true },
        }),
        ...(metadata?.logoUrl && {
            logoUrl: { data: metadata.logoUrl, isCopyable: true },
        }),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`popups.nativeToken.property.${key}`)}
        valueText={value.data}
        isCopyable={value.isCopyable}
    />
{/each}
