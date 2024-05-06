<script lang="ts">
    import { type IItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, getDefaultExplorerUrl, getL1Network } from '@core/network'
    import { IIrc27Nft } from '@core/nfts'
    import { formatTokenAmount } from '@core/token'
    import { getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes } from '@core/wallet'
    import { AddressType } from '@iota/sdk/out/types'
    import { NetworkLabel } from '@ui'
    import CollectibleDetails from './CollectibleDetails.svelte'
    import { buildUrl } from '@core/utils/url'

    export let nft: IIrc27Nft

    const l1Network = getL1Network()

    const { id, issuer, nftAddress, metadata, storageDeposit, mediaUrl } = nft ?? {}
    const { standard, version, issuerName, collectionName } = nft?.metadata || {}

    const explorerEndpoint = getExplorerEndpoint()

    const issuerAddress = getBech32AddressFromAddressTypes(issuer)
    const collectionId = getHexAddressFromAddressTypes(issuer)

    let details: IItem[] = []
    $: details = [
        {
            key: localize('general.network'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId: nft.networkId,
                },
            },
        },
        {
            key: localize('general.nftId'),
            value: id || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.address'),
            value: nftAddress || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.url'),
            value: mediaUrl || undefined,
            copyable: true,
        },
        {
            key: localize('general.storageDeposit'),
            value: storageDeposit ? formatTokenAmount(storageDeposit, l1Network.baseToken) : undefined,
        },
        {
            key: localize('general.standard'),
            value: version ? `${standard} - ${version}` : standard,
        },
        {
            key: localize('general.issuer'),
            value: issuerName || undefined,
        },
        {
            key: localize('general.issuerAddress'),
            value: issuer?.type === AddressType.Ed25519 ? issuerAddress : undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.collection'),
            value: collectionName || undefined,
        },
        {
            key: localize('general.collectionId'),
            value: issuer?.type === AddressType.Nft || issuer?.type === AddressType.Alias ? collectionId : undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.metadata'),
            value: !nft?.metadata && metadata ? metadata : undefined,
            copyable: true,
        },
    ]

    function getExplorerEndpoint(): string | undefined {
        // We don't use `nft.networkId` on this one, as for IRC27 nfts we still want the L1 explorer
        const { baseUrl, endpoint } = getDefaultExplorerUrl(l1Network.id, ExplorerEndpoint.Nft)
        const url = buildUrl({
            origin: baseUrl,
            pathname: `${endpoint}/${id}`,
        })

        return url?.href
    }
</script>

<CollectibleDetails {nft} {details} attributes={nft.metadata?.attributes} {explorerEndpoint} />
