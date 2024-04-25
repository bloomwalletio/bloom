<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { Nft, getPrimaryNftUrl } from '@core/nfts'
    import { NftStandard } from '@core/nfts/enums'

    export let nft: Nft
</script>

{#if nft?.metadata}
    {#if nft.standard === NftStandard.Irc27}
        {@const metadata = nft.metadata}
        <Table
            items={[
                {
                    key: localize('general.standard'),
                    value:
                        metadata.standard && metadata.version
                            ? `${metadata.standard} - ${metadata.version}`
                            : metadata.standard,
                },
                {
                    key: localize('general.type'),
                    value: metadata.type,
                    tooltip: localize('tooltips.transactionDetails.nftMetadata.type'),
                },
                {
                    key: localize('general.uri'),
                    value: metadata.uri,
                    onClick: () => openUrlInBrowser(getPrimaryNftUrl(metadata?.uri ?? '')),
                },
                {
                    key: localize('general.description'),
                    value: metadata.description,
                },
                {
                    key: localize('general.issuerName'),
                    value: metadata.issuerName,
                    tooltip: localize('tooltips.transactionDetails.nftMetadata.issuerName'),
                },
                {
                    key: localize('general.collectionName'),
                    value: metadata.collectionName,
                },
                {
                    key: localize('general.attributes'),
                    value: metadata.attributes,
                },
                {
                    key: localize('general.royalties'),
                    value: metadata.royalties,
                },
            ]}
        />
    {:else}
        {@const metadata = nft.metadata}
        <Table
            items={[
                {
                    key: localize('general.type'),
                    value: metadata.type,
                    tooltip: localize('tooltips.transactionDetails.nftMetadata.type'),
                },
                {
                    key: localize('general.image'),
                    value: metadata.image,
                    onClick: () => openUrlInBrowser(getPrimaryNftUrl(metadata?.image ?? '')),
                },
                {
                    key: localize('general.description'),
                    value: metadata.description,
                },
                {
                    key: localize('general.attributes'),
                    value: metadata.attributes,
                },
            ]}
        />
    {/if}
{/if}
