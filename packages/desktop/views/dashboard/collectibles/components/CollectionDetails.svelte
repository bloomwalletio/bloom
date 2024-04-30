<script lang="ts">
    import { Collection } from '@core/nfts'
    import { selectedCollectionId } from '@core/nfts/stores'
    import { NftGallery } from '@ui'
    import { onDestroy } from 'svelte'

    export let collection: Collection

    onDestroy(() => {
        $selectedCollectionId = undefined
    })
</script>

<NftGallery nfts={collection.nfts} />
