<script lang="ts">
    import { Pane } from '@ui'
    import { Nft } from '@core/nfts/interfaces'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { NftStandard } from '@core/nfts/enums'
    import { selectedNftId } from '@core/nfts/stores'
    import { selectedAccountIndex } from '@core/account/stores'
    import { Erc721CollectibleDetails, Irc27CollectibleDetails } from '../components'

    const nft: Nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)
    const { standard } = nft
</script>

<Pane classes="h-full">
    {#if standard === NftStandard.Irc27}
        <Irc27CollectibleDetails {nft} />
    {:else if standard === NftStandard.Erc721}
        <Erc721CollectibleDetails {nft} />
    {/if}
</Pane>
