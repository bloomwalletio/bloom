<script lang="ts">
    import { type IItem } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, getActiveNetworkId, getDefaultExplorerUrl } from '@core/network'
    import { IIrc27Nft } from '@core/nfts'
    import { allAccountNfts } from '@core/nfts/stores'
    import { getBaseToken } from '@core/profile/actions'
    import { collectiblesRouter } from '@core/router/routers'
    import { formatTokenAmountPrecise } from '@core/token'
    import { getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes } from '@core/wallet'
    import { AddressType } from '@iota/sdk/out/types'
    import { NetworkLabel } from '@ui'
    import CollectibleDetails from './CollectibleDetails.svelte'

    export let nft: IIrc27Nft

    const { id, issuer, address, metadata, storageDeposit } = nft ?? {}
    const { standard, version, issuerName, collectionName } = nft?.metadata || {}

    // We don't use `nft.networkId` on this one, as for IRC27 nfts we still want the L1 explorer
    const explorerUrl = getDefaultExplorerUrl(getActiveNetworkId(), ExplorerEndpoint.Nft)
    const explorerEndpoint = explorerUrl ? `${explorerUrl}/${id}` : ''

    const issuerAddress = getBech32AddressFromAddressTypes(issuer)
    const collectionId = getHexAddressFromAddressTypes(issuer)

    $: returnIfNftWasSent($allAccountNfts[$selectedAccountIndex], $time)

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
            value: address || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.storageDeposit'),
            value: storageDeposit ? formatTokenAmountPrecise(storageDeposit, getBaseToken()) : undefined,
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

    function returnIfNftWasSent(ownedNfts: IIrc27Nft[], currentTime: Date): void {
        const nft = ownedNfts.find((nft) => nft.id === id)
        const isLocked = nft.timelockTime > currentTime.getTime()
        if (nft?.isSpendable || isLocked) {
            // empty
        } else {
            $collectiblesRouter.previous()
        }
    }
</script>

<CollectibleDetails {nft} {details} attributes={nft.metadata.attributes} {explorerEndpoint} />
