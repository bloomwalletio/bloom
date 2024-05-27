<script lang="ts">
    import { ownedNfts, selectedCollectionId } from '@core/nfts/stores'
    import { NftGallery } from '@ui'
    import { onDestroy } from 'svelte'

    export let collectionId: string

    $: nfts = $ownedNfts.filter((nft) => nft.collectionId === collectionId && !nft.hidden && !nft.isScam)

    onDestroy(() => {
        $selectedCollectionId = undefined
    })
</script>

<NftGallery {nfts} />
