<script lang="ts">
    import { Pane } from '@ui'
    import { Collection, Nft } from '@core/nfts/interfaces'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { NftStandard } from '@core/nfts/enums'
    import { allAccountNfts, selectedAccountCollections, selectedCollectionId, selectedNftId } from '@core/nfts/stores'
    import { selectedAccountIndex } from '@core/account/stores'
    import { CollectionDetails, Erc721CollectibleDetails, Irc27CollectibleDetails } from '../components'
    import { time } from '@core/app/stores'
    import { collectiblesRouter } from '@core/router'
    import { isIrc27Nft } from '@core/nfts'

    let nft: Nft | undefined
    let collection: Collection | undefined
    $: $allAccountNfts, (nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId))
    $: collection = $selectedCollectionId ? $selectedAccountCollections[$selectedCollectionId] : undefined

    $: returnIfNftWasSent($allAccountNfts[$selectedAccountIndex], $time)

    function returnIfNftWasSent(ownedNfts: Nft[], currentTime: Date): void {
        if (!nft) return

        const ownedNft = ownedNfts.find((_nft) => _nft.id === nft?.id)
        const isLocked = ownedNft && isIrc27Nft(ownedNft) && ownedNft.timelockTime > currentTime.getTime()
        if (ownedNft?.isSpendable || isLocked) {
            // empty
        } else {
            $collectiblesRouter.previous()
        }
    }
</script>

{#if collection}
    <CollectionDetails {collection} />
{:else}
    <Pane classes="h-full">
        {#if nft?.standard === NftStandard.Irc27}
            <Irc27CollectibleDetails {nft} />
        {:else if nft?.standard === NftStandard.Erc721}
            <Erc721CollectibleDetails {nft} />
        {/if}
    </Pane>
{/if}
