<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { StardustNftActivity } from '@core/activity'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint } from '@core/network/enums'
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { NftStandard } from '@core/nfts/enums'
    import { getNftByIdForAccount } from '@core/nfts/stores'
    import { buildUrl } from '@core/utils'
    import { getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes } from '@core/wallet'
    import { type Address, AddressType } from '@iota/sdk/out/types'

    export let activity: StardustNftActivity

    $: nft = getNftByIdForAccount($selectedAccountIndex, activity?.nftId)
    $: issuer = nft?.standard === NftStandard.Irc27 ? nft?.issuer : undefined

    function onNftIdClick(nftId: string) {
        const { baseUrl, endpoint } = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Nft)
        const url = buildUrl({ origin: baseUrl, pathname: `${endpoint}/${nftId}` })
        openUrlInBrowser(url?.href)
    }

    function onIssuerClick(issuer: Address) {
        const { baseUrl, endpoint } = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Address)
        const url = buildUrl({ origin: baseUrl, pathname: `${endpoint}/${getBech32AddressFromAddressTypes(issuer)}` })
        openUrlInBrowser(url?.href)
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
