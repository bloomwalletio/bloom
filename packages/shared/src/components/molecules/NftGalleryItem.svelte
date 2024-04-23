<script lang="typescript">
    import { Pill, Text, Tooltip, type TextColor } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IDownloadMetadata, Nft } from '@core/nfts'
    import { downloadingNftId, selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { MediaPlaceholder, NetworkAvatar, NftMedia } from '@ui'
    import AssetPillsForNft from '@ui/nfts/AssetPillsForNft.svelte'
    import AsyncPillsForNft from '@ui/nfts/AsyncPillsForNft.svelte'

    export let nft: Nft

    let nftWrapperClientWidth: number
    let anchor: HTMLElement

    $: placeHolderColor = nft.downloadMetadata?.error
        ? 'danger'
        : nft.downloadMetadata?.warning
          ? 'warning'
          : ('brand' as TextColor)

    function onNftClick(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
        $collectiblesRouter.setBreadcrumb(nft?.name)
    }

    function getAlertText(downloadMetadata: IDownloadMetadata | undefined): string {
        const { error, warning } = downloadMetadata ?? {}
        const errorOrWarning = error || warning

        if (!errorOrWarning) {
            return ''
        }

        const { type, message } = errorOrWarning
        return type === 'generic' ? message ?? '' : localize(`error.nft.${type}.short`)
    }
</script>

<button type="button" on:click={onNftClick} class="nft-gallery-item w-full">
    <container>
        <div
            class="w-full flex relative bg-surface-2 dark:bg-surface-2-dark"
            bind:clientWidth={nftWrapperClientWidth}
            style="height: {nftWrapperClientWidth}px; "
        >
            <NftMedia {nft} classes="min-w-full min-h-full object-cover" loop muted>
                <MediaPlaceholder
                    type={nft?.type}
                    textColor={placeHolderColor}
                    downloading={$downloadingNftId === nft?.id}
                    size="md"
                    slot="placeholder"
                />
            </NftMedia>
            <error-container bind:this={anchor}>
                {#if nft.downloadMetadata?.error || nft.downloadMetadata?.warning}
                    <Pill color={nft.downloadMetadata?.error ? 'danger' : 'warning'}>
                        {localize('general.' + (nft.downloadMetadata?.error ? 'error' : 'warning'))}
                    </Pill>
                {/if}
            </error-container>
            <Tooltip {anchor} placement="bottom" event="hover" text={getAlertText(nft.downloadMetadata)} />
        </div>
        <div class="flex flex-col gap-2 p-3">
            <nft-name class="w-full flex flex-row items-center justify-between gap-2">
                <Text type="body2" truncate>{nft.name}</Text>
            </nft-name>
            <nft-pills class="flex flex-row items-center gap-2">
                <NetworkAvatar networkId={nft.networkId} size="sm" showTooltip />
                <AssetPillsForNft {nft} />
                <AsyncPillsForNft {nft} />
            </nft-pills>
        </div>
    </container>
</button>

<style lang="postcss">
    .nft-gallery-item {
        container {
            @apply w-full overflow-hidden flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark;
            @apply border border-solid border-stroke dark:border-stroke-dark;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            @apply rounded-2xl;
            @apply duration-300;
            transition-property: background-color, border-color, box-shadow;
        }

        &:hover,
        &:focus {
            container {
                @apply shadow-lg dark:shadow-violet-900/25;
                @apply border-2 border-brand-500;
                @apply bg-surface dark:bg-surface-dark;
            }
        }
    }

    error-container {
        @apply absolute left-3 top-3;
    }
</style>
