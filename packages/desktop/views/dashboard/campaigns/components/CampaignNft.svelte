<script lang="ts">
    import { Icon, IconName, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { MediaPlaceholder, NftMedia } from '@ui'
    import { downloadingNftId } from '@core/nfts/stores'
    import { MimeType } from '@core/nfts/enums'
    import { Nft } from '@core/nfts'

    export let nft: Nft | undefined

    let placeholderWidth: number
</script>

<div class="absolute flex flex-row w-full p-4">
    <Pill color={nft ? 'primary' : 'neutral'} opaque>
        <div class="flex flex-row space-x-1 items-center text-invert">
            <Icon size="xxs" customColor="text-invert" name={IconName.Trophy} />
            <div>
                {localize(`views.campaigns.${nft ? 'myNft' : 'noNft'}`)}
            </div>
        </div>
    </Pill>
</div>
{#if nft}
    <NftMedia {nft} classes="min-w-full min-h-full object-cover" loop muted>
        <MediaPlaceholder
            type={nft?.type}
            textColor="primary"
            downloading={$downloadingNftId === nft?.id}
            size="md"
            slot="placeholder"
        />
    </NftMedia>
{:else}
    <div
        bind:clientWidth={placeholderWidth}
        style={`height: ${placeholderWidth}px;`}
        class="flex w-full min-w-full aspect-square"
    >
        <MediaPlaceholder type={MimeType.ImagePng} textColor="primary" size="lg" />
    </div>
{/if}
