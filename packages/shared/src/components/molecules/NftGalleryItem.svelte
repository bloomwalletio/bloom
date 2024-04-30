<script lang="typescript">
    import { Pill, Text, Tooltip, type TextColor } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DownloadErrorType, IDownloadMetadata, Nft } from '@core/nfts'
    import { downloadingNftId, selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { MediaPlaceholder, NetworkAvatar, NftMedia } from '@ui'
    import AssetPillsForNft from '@ui/nfts/AssetPillsForNft.svelte'
    import AsyncPillsForNft from '@ui/nfts/AsyncPillsForNft.svelte'

    export let nft: Nft

    let anchor: HTMLElement

    $: placeHolderColor = nft.downloadMetadata?.error
        ? 'danger'
        : nft.downloadMetadata?.warning
          ? 'warning'
          : ('brand' as TextColor)

    function onNftClick(): void {
        $selectedNftId = nft.id
        $collectiblesRouter?.goTo(CollectiblesRoute.Details)
        $collectiblesRouter?.setBreadcrumb(nft?.name)
    }

    function getAlertText(downloadMetadata: IDownloadMetadata | undefined): string {
        if (downloadMetadata?.error?.type === DownloadErrorType.Generic) {
            return downloadMetadata.responseCode + ' ' + downloadMetadata.error.message
        }

        const errorOrWarning = downloadMetadata?.error || downloadMetadata?.warning
        if (!errorOrWarning) {
            return ''
        }
        return localize(`error.nft.${errorOrWarning.type}.short`)
    }
</script>

<button type="button" on:click={onNftClick}>
    <div class="flex-1 w-full flex relative bg-surface-2 dark:bg-surface-2-dark">
        <NftMedia {nft} classes="min-w-full min-h-full object-cover" loop muted>
            <MediaPlaceholder
                type={nft?.type}
                textColor={placeHolderColor}
                downloading={$downloadingNftId === nft?.id}
                size="md"
                slot="placeholder"
            />
        </NftMedia>
        <error-container bind:this={anchor} class="absolute left-3 top-3">
            {#if nft.isScam}
                <Pill color="warning">{localize('general.warning')}</Pill>
            {:else if nft.downloadMetadata?.error || nft.downloadMetadata?.warning}
                <Pill color={nft.downloadMetadata?.error ? 'danger' : 'warning'}>
                    {localize('general.' + (nft.downloadMetadata?.error ? 'error' : 'warning'))}
                </Pill>
            {/if}
        </error-container>
        <Tooltip
            {anchor}
            placement="bottom"
            event="hover"
            text={nft.isScam ? localize('error.nft.scamNft.short') : getAlertText(nft.downloadMetadata)}
        />
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
</button>

<style lang="postcss">
    button {
        @apply w-full overflow-hidden flex flex-col;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply border-2 border-solid border-stroke dark:border-stroke-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply rounded-2xl;
        @apply duration-300;
        transition-property: background-color, border-color, box-shadow;
        aspect-ratio: 3 / 4;

        &:hover,
        &:focus {
            @apply shadow-lg dark:shadow-violet-900/25;
            @apply border-2 border-brand-500;
            @apply bg-surface dark:bg-surface-dark;
        }
    }
</style>
