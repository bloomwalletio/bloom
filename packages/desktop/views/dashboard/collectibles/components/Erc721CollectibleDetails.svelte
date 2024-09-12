<script lang="ts">
    import { NetworkLabel } from '@ui'
    import { type IItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IErc721Nft } from '@core/nfts'
    import { EvmNetworkId, getExplorerUrl } from '@core/network'
    import { ExplorerEndpoint } from '@auxiliary/explorer'
    import CollectibleDetails from './CollectibleDetails.svelte'

    export let nft: IErc721Nft

    const { standard, networkId, contractMetadata, tokenId, metadata, mediaUrl } = nft
    const address = contractMetadata.address
    const explorerUrl = buildExplorerUrl(networkId)

    function buildExplorerUrl(networkId: EvmNetworkId): string | undefined {
        if (tokenId) {
            return getExplorerUrl(networkId, ExplorerEndpoint.Token, `${address}/instance/${tokenId}`)
        } else {
            return getExplorerUrl(networkId, ExplorerEndpoint.Address, address)
        }
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

<CollectibleDetails {nft} {details} attributes={metadata.attributes} explorerEndpoint={explorerUrl} />
