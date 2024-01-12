<script lang="ts">
    import { Pane } from '@ui'
    import { Nft } from '@core/nfts/interfaces'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { NftStandard } from '@core/nfts/enums'
    import { allAccountNfts, selectedNftId } from '@core/nfts/stores'
    import { selectedAccountIndex } from '@core/account/stores'
    import { Erc721CollectibleDetails, Irc27CollectibleDetails } from '../components'
    import { time } from '@core/app/stores'
    import { collectiblesRouter } from '@core/router'
    import { isIrc27Nft } from '@core/nfts'

    const nft: Nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)
    const { standard } = nft

    $: returnIfNftWasSent($allAccountNfts[$selectedAccountIndex], $time)

    function returnIfNftWasSent(ownedNfts: INft[], currentTime: Date): void {
        const ownedNft = ownedNfts.find((_nft) => _nft.id === nft.id)
        const isLocked = isIrc27Nft(ownedNft) && ownedNft.timelockTime > currentTime.getTime()
        if (ownedNft?.isSpendable || isLocked) {
            // empty
        } else {
            $collectiblesRouter.previous()
        }
    }
</script>

<Pane classes="h-full">
    {#if standard === NftStandard.Irc27}
        <Irc27CollectibleDetails {nft} />
    {:else if standard === NftStandard.Erc721}
        <Erc721CollectibleDetails {nft} />
    {/if}
</Pane>
