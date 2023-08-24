<script lang="ts">
    import { Table, type IItems } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { NftActivity } from '@core/activity'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import {
        ADDRESS_TYPE_ALIAS,
        ADDRESS_TYPE_ED25519,
        ADDRESS_TYPE_NFT,
        getBech32AddressFromAddressTypes,
        getHexAddressFromAddressTypes,
    } from '@core/wallet'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)
    $: issuerAddress = getBech32AddressFromAddressTypes(nft?.issuer)
    $: collectionId = getHexAddressFromAddressTypes(nft?.issuer)

    const items: IItems[] = []
    function setItems(activity: NftActivity): void {
        items.push({
            key: localize('general.nftId'),
            value: activity?.nftId,
            truncate: { firstCharCount: 10, endCharCount: 10 },
            copyable: true,
        })
        if (nft?.issuer?.type === ADDRESS_TYPE_ED25519) {
            items.push({
                key: localize('general.issuerAddress'),
                value: issuerAddress,
                truncate: { firstCharCount: 10, endCharCount: 10 },
                copyable: true,
            })
        }
        if (nft?.issuer?.type === ADDRESS_TYPE_NFT || nft?.issuer?.type === ADDRESS_TYPE_ALIAS) {
            items.push({
                key: localize('general.collectionId'),
                value: collectionId,
                truncate: { firstCharCount: 10, endCharCount: 10 },
                copyable: true,
            })
        }
    }
    $: setItems(activity)
</script>

<Table {items} />
