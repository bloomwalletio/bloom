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
            <Icon size="xxs" customColor="text-invert" name={IconName.Gift} />
            <div>
                {localize(`views.campaigns.details.${nft ? 'nftBadge' : 'noNftBadge'}`)}
            </div>
        </div>
    </Pill>
</div>
<div
    bind:clientWidth={placeholderWidth}
    style={`max-height: ${placeholderWidth}px;`}
    class="flex w-full h-full overflow-hidden"
>
    {#if nft}
        <NftMedia {nft} classes="w-full h-full object-cover" loop muted>
            <MediaPlaceholder
                type={nft?.type}
                textColor="primary"
                downloading={$downloadingNftId === nft?.id}
                size="md"
                slot="placeholder"
            />
        </NftMedia>
    {:else}
        <MediaPlaceholder type={MimeType.ImagePng} textColor="primary" size="lg" />
    {/if}
</div>
