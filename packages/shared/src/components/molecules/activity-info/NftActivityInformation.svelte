<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { NftActivity } from '@core/activity'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint } from '@core/network/enums'
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { NftStandard } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes } from '@core/wallet'
    import { type Address, AddressType } from '@iota/sdk/out/types'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)
    $: issuer = nft?.standard === NftStandard.Irc27 ? nft?.issuer : undefined

    function onNftIdClick(nftId: string) {
        const explorerUrl = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Nft)
        openUrlInBrowser(`${explorerUrl}/${nftId}`)
    }

    function onIssuerClick(issuer: Address) {
        const explorerUrl = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Address)
        openUrlInBrowser(`${explorerUrl}/${getBech32AddressFromAddressTypes(issuer)}`)
    }
</script>

<Table
    items={[
        {
            key: localize('general.nftId'),
            value: activity?.nftId,
            onClick: () => onNftIdClick(activity?.nftId),
        },
        {
            key: localize('general.issuerAddress'),
            value: issuer?.type === AddressType.Ed25519 ? getBech32AddressFromAddressTypes(issuer) : undefined,
            onClick: () => issuer && onIssuerClick(issuer),
        },
        {
            key: localize('general.collectionId'),
            value:
                issuer && [AddressType.Nft, AddressType.Alias].includes(issuer?.type)
                    ? getHexAddressFromAddressTypes(issuer)
                    : undefined,
            onClick: () => issuer && onIssuerClick(issuer),
        },
    ]}
/>
