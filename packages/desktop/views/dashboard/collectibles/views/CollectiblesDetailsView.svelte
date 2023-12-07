<script lang="ts">
    import { Pane } from '@ui'
    import { INft } from '@core/nfts/interfaces'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { NftStandard } from '@core/nfts/enums'
    import { selectedNftId } from '@core/nfts/stores'
    import { selectedAccountIndex } from '@core/account/stores'
    import { Irc27CollectibleDetails } from '../components'

    const nft: INft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)
    const { standard } = nft
</script>

<Pane classes="h-full">
    {#if standard === NftStandard.Irc27}
        <Irc27CollectibleDetails {nft} />
    {:else}
        <p>not yet...</p>
    {/if}
</Pane>

<style lang="scss">
    collectibles-details-view {
        @apply divide-x divide-solid divide-stroke dark:divide-stroke-dark;
    }

    media-container {
        :global(*) {
            @apply rounded-xl;
            @apply object-contain object-center;
            @apply max-w-full max-h-full;
        }
    }

    error-container {
        @apply absolute left-8 top-8 w-100 overflow-hidden;
    }

    details-container {
        @apply max-w-lg;
    }
</style>
