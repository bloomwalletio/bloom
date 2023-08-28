<script lang="ts">
    import { Table, type IItems } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { NftActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { IIrc27Metadata, convertAndFormatNftMetadata } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { TokenStandard } from '@core/token'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)

    let items: IItems[] = []
    function setItems(metadata: IIrc27Metadata | undefined) {
        if (!metadata) return
        items = []

        if (metadata?.standard) {
            items.push({
                key: localize('general.standard'),
                value: metadata.version ? `${metadata.standard} - ${metadata.version}` : metadata?.standard,
            })
        }
        if (metadata?.type) {
            items.push({
                key: localize('general.type'),
                value: metadata.type as string,
                popover: { content: localize('tooltips.transactionDetails.nftMetadata.type') },
            })
        }
        if (metadata?.uri) {
            items.push({
                key: localize('general.uri'),
                value: metadata.uri,
                copyable: true,
            })
        }
        if (metadata?.issuerName) {
            items.push({
                key: localize('general.issuerName'),
                value: metadata.issuerName,
                popover: { content: localize('tooltips.transactionDetails.nftMetadata.issuerName') },
            })
        }
        if (metadata?.collectionName) {
            items.push({
                key: localize('general.collectionName'),
                value: metadata.collectionName,
            })
        }
        if (metadata?.standard !== TokenStandard.Irc27) {
            items.push({
                key: localize('general.metadata'),
                value: convertAndFormatNftMetadata(metadata),
            })
        }
    }
    $: setItems(nft?.parsedMetadata)
</script>

<Table {items} />
