<script lang="ts">
    import { ITokenWithBalance, getUnitFromTokenMetadata } from '@core/token'
    import { truncateString } from '@core/utils'
    import { FontWeight, NftImageOrIconBox, Text, TokenAvatar } from '@ui'
    import { INft } from '@core/nfts'

    export let token: ITokenWithBalance | undefined
    export let nft: INft | undefined
</script>

{#if token}
    <TokenAvatar {token} size="md" />
    <div class="flex flex-col items-start justify-between">
        <Text fontWeight={FontWeight.semibold}>
            {token.metadata.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)}
        </Text>
        <Text fontWeight={FontWeight.semibold} secondary>
            {getUnitFromTokenMetadata(token.metadata)}
        </Text>
    </div>
{:else if nft}
    <NftImageOrIconBox {nft} size="medium" />
    <div class="flex flex-col items-start justify-between">
        <Text fontWeight={FontWeight.semibold}>
            {nft.parsedMetadata?.name ? truncateString(nft.parsedMetadata?.name, 13, 0) : 'NFT'}
        </Text>
        <Text fontWeight={FontWeight.semibold} secondary>
            {truncateString(nft.id, 6, 7)}
        </Text>
    </div>
{:else}
    <!-- else content here -->
{/if}
