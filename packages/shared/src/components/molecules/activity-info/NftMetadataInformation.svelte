<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { NftActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { TokenStandard } from '@core/token'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)
</script>

{#if nft?.parsedMetadata}
    {@const metadata = nft.parsedMetadata}
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
                copyable: true,
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
                key: localize('general.metadata'),
                value: metadata.standard !== TokenStandard.Irc27 ? metadata : undefined,
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
{/if}
