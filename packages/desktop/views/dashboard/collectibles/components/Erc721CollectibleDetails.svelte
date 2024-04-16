<script lang="ts">
    import { NetworkLabel } from '@ui'
    import { type IItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IErc721Nft } from '@core/nfts'
    import { ExplorerEndpoint, EvmNetworkId, getDefaultExplorerUrl } from '@core/network'
    import CollectibleDetails from './CollectibleDetails.svelte'
    import { buildUrl } from '@core/utils'

    export let nft: IErc721Nft

    const { standard, networkId, contractMetadata, tokenId, metadata, mediaUrl } = nft
    const address = contractMetadata.address
    const explorerEndpoint = getExplorerEndpoint(networkId)

    function getExplorerEndpoint(networkId: EvmNetworkId): string | undefined {
        const { baseUrl, endpoint } = getDefaultExplorerUrl(networkId, ExplorerEndpoint.Token)
        const url = buildUrl({
            origin: baseUrl,
            pathname: tokenId ? `${endpoint}/${address}/instance/${tokenId}` : address,
        })
        return url?.href
    }

    let details: IItem[] = []
    $: details = [
        {
            key: localize('general.network'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId,
                },
            },
        },
        {
            key: localize('general.contractAddress'),
            value: address || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.tokenId'),
            value: tokenId,
        },
        {
            key: localize('general.url'),
            value: mediaUrl || undefined,
            copyable: true,
        },
        {
            key: localize('general.standard'),
            value: standard,
        },
        {
            key: localize('general.collection'),
            value: contractMetadata.name || undefined,
        },
        {
            key: localize('general.metadata'),
            value: metadata,
            copyable: true,
        },
    ]
</script>

<CollectibleDetails {nft} {details} attributes={metadata.attributes} {explorerEndpoint} />
