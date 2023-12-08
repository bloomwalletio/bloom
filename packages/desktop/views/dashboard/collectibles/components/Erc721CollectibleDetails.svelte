<script lang="ts">
    import { NetworkLabel } from '@ui'
    import { type IItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IErc721Nft } from '@core/nfts'
    import { ExplorerEndpoint, NetworkId, getDefaultExplorerUrl } from '@core/network'
    import CollectibleDetails from './CollectibleDetails.svelte'

    export let nft: IErc721Nft

    const { standard, address, networkId, metadata, tokenId } = nft
    const explorerEndpoint = getExplorerEndpoint(networkId)

    function getExplorerEndpoint(networkId: NetworkId): string | undefined {
        const explorerUrl = getDefaultExplorerUrl(networkId, ExplorerEndpoint.Token)
        if (!explorerUrl) {
            return undefined
        }
        const contractUrl = `${explorerUrl}/${address}`
        return tokenId ? `${contractUrl}/instance/${tokenId}` : contractUrl
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
            key: localize('general.standard'),
            value: standard,
        },
        {
            key: localize('general.collection'),
            value: metadata.contract.name || undefined,
        },
        {
            key: localize('general.metadata'),
            value: !nft?.metadata && metadata ? metadata : undefined,
            copyable: true,
        },
    ]
</script>

<CollectibleDetails {nft} {details} attributes={metadata.token.attributes} {explorerEndpoint} />
