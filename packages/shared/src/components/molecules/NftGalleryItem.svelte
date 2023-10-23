<script lang="typescript">
    import { MediaPlaceholder, NftMedia } from '@ui'
    import { IconName, Pill, Text, TextColor, Tooltip, TooltipIcon } from '@bloomwalletio/ui'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { INft, NftDownloadMetadata } from '@core/nfts'
    import { selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { getTimeDifference } from '@core/utils'

    export let nft: INft

    let nftWrapperClientWidth: number
    let anchor: HTMLElement

    $: isLocked = nft.timelockTime && nft.timelockTime > $time.getTime()
    $: placeHolderColor = nft.downloadMetadata.error
        ? 'danger'
        : nft.downloadMetadata.warning
        ? 'warning'
        : ('brand' as TextColor)

    function onNftClick(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
        $collectiblesRouter.setBreadcrumb(nft?.name)
    }

    function getAlertText(downloadMetadata: NftDownloadMetadata): string {
        const { error, warning } = downloadMetadata ?? {}
        const errorOrWarning = error || warning

        if (!errorOrWarning) {
            return ''
        }

        const { type, message } = errorOrWarning
        return type === 'generic' ? message ?? '' : localize(`error.nft.${type}.short`)
    }
</script>

<button type="button" on:click={onNftClick} class="nft-gallery-item flex flex-col items-center justify-center">
    <div
        class="w-full rounded-2xl overflow-hidden flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark"
    >
        <div
            class="w-full flex relative bg-surface-2 dark:bg-surface-2-dark"
            bind:clientWidth={nftWrapperClientWidth}
            style="height: {nftWrapperClientWidth}px; "
        >
            <NftMedia {nft} classes="min-w-full min-h-full object-cover" loop muted showErrorColor>
                <div
                    class="w-full h-full flex justify-center items-center bg-surface-2 dark:bg-surface-2-dark"
                    slot="placeholder"
                >
                    <placeholder-container>
                        <MediaPlaceholder
                            type={nft?.parsedMetadata?.type}
                            nftId={nft.id}
                            textColor={placeHolderColor}
                            size="md"
                        />
                    </placeholder-container>
                </div>
            </NftMedia>
            <error-container bind:this={anchor}>
                {#if nft.downloadMetadata.error || nft.downloadMetadata.warning}
                    <Pill color={nft.downloadMetadata?.error ? 'danger' : 'warning'}>
                        {localize('general.' + (nft.downloadMetadata?.error ? 'error' : 'warning'))}
                    </Pill>
                {/if}
            </error-container>
            <Tooltip {anchor} placement="bottom" event="hover" text={getAlertText(nft.downloadMetadata)} />
        </div>
        <div class="w-full flex flex-row items-center justify-between p-3 gap-2">
            <Text type="body2" truncate>{nft.name}</Text>
            {#if isLocked}
                <TooltipIcon
                    icon={IconName.Locked}
                    tooltip={localize('views.collectibles.gallery.timelocked', {
                        timeDiff: getTimeDifference(new Date(nft.timelockTime), $time),
                    })}
                    placement="top"
                />
            {/if}
        </div>
    </div>
</button>

<style lang="scss">
    .nft-gallery-item {
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply rounded-2xl;
        @apply hover:bg-surface-1 dark:hover:bg-surface-1-dark;
    }

    error-container {
        @apply absolute left-3 top-3;
    }
    placeholder-container {
        @apply rounded-full;
        @apply bg-surface dark:bg-surface-dark;
        @apply flex items-center justify-center text-center;
        @apply h-20 w-20;
    }
</style>
