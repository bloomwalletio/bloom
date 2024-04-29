<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { Nft, NftStandard } from '@core/nfts'

    export let nft: Nft
</script>

{#if nft.standard}
    <nft-standard-pill>
        <Pill color="neutral" compact>
            {nft.standard === NftStandard.Erc721 ? 'ERC721' : nft.standard === NftStandard.Irc27 ? 'IRC27' : undefined}
        </Pill>
    </nft-standard-pill>
{/if}
