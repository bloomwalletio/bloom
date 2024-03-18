<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { TokenMetadata, TokenStandard } from '@core/token'

    export let token: TokenMetadata
</script>

{#if token.standard === TokenStandard.Irc30}
    <Table
        items={[
            {
                key: localize('popups.nativeToken.property.tokenName'),
                value: token.name || undefined,
            },
            {
                key: localize('popups.nativeToken.property.unit'),
                value: token.symbol || undefined,
            },
            {
                key: localize('popups.nativeToken.property.decimals'),
                value: String(token.decimals) || undefined,
            },
            {
                key: localize('popups.nativeToken.property.description'),
                value: token.description || undefined,
            },
            {
                key: localize('popups.nativeToken.property.url'),
                value: token.url || undefined,
                onClick: () => openUrlInBrowser(token?.url ?? ''),
            },
            {
                key: localize('popups.nativeToken.property.logo'),
                value: token.logo || undefined,
                copyable: true,
            },
            {
                key: localize('popups.nativeToken.property.logoUrl'),
                value: token.logoUrl || undefined,
                onClick: () => openUrlInBrowser(token?.logoUrl ?? ''),
            },
        ]}
    />
{:else if token.standard === TokenStandard.Erc20}
    <Table
        items={[
            {
                key: localize('popups.nativeToken.property.tokenName'),
                value: token.name || undefined,
            },
            {
                key: localize('popups.nativeToken.property.unit'),
                value: token.symbol || undefined,
            },
            {
                key: localize('popups.nativeToken.property.decimals'),
                value: String(token.decimals) || undefined,
            },
        ]}
    />
{/if}
