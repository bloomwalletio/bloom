<script lang="ts">
    import { AddressType } from '@iota/sdk/out/types'
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { NftActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes } from '@core/wallet'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)
</script>

<Table
    items={[
        {
            key: localize('general.nftId'),
            value: activity?.nftId,
            truncate: { firstCharCount: 10, endCharCount: 10 },
            copyable: true,
        },
        {
            key: localize('general.issuerAddress'),
            value:
                nft?.issuer?.type === AddressType.Ed25519 ? getBech32AddressFromAddressTypes(nft?.issuer) : undefined,
            truncate: { firstCharCount: 10, endCharCount: 10 },
            copyable: true,
        },
        {
            key: localize('general.collectionId'),
            value: [AddressType.Nft, AddressType.Alias].includes(nft?.issuer?.type)
                ? getHexAddressFromAddressTypes(nft?.issuer)
                : undefined,
            truncate: { firstCharCount: 10, endCharCount: 10 },
            copyable: true,
        },
    ]}
/>
