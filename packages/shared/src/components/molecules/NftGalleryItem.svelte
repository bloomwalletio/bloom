<script lang="typescript">
    import { MediaPlaceholder, NftMedia } from '@ui'
    import { IconName, Pill, Text, Tooltip, TooltipIcon } from '@bloomwalletio/ui'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { INft, INftDownloadStatus, isNftLocked } from '@core/nfts'
    import { selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { getTimeDifference } from '@core/utils'

    export let nft: INft

    let nftWrapperClientWidth: number
    let anchor: HTMLElement

    $: isLocked = isNftLocked(nft)

    function onNftClick(): void {
        $selectedNftId = nft.id
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
        $collectiblesRouter.setBreadcrumb(nft?.name)
    }

    function getAlertText(downloadMetadata: INftDownloadStatus): string {
        const { error, warning } = downloadMetadata ?? {}
        const errorOrWarning = error || warning

        if (!errorOrWarning) {
            return ''
        }

        const { type, message } = errorOrWarning
        return type === 'generic' ? message ?? '' : localize(`error.nft.${type}.short`)
    }
</script>

<button type="button" on:click={onNftClick} class="nft-gallery-item">
    <container>
        <div
            class="w-full flex relative bg-surface-2 dark:bg-surface-2-dark"
            bind:clientWidth={nftWrapperClientWidth}
            style="height: {nftWrapperClientWidth}px; "
        >
            <NftMedia {nft} classes="min-w-full min-h-full object-cover" loop muted>
                <MediaPlaceholder {nft} size="md" slot="placeholder" />
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
        <nft-name class="w-full flex flex-row items-center justify-between p-3 gap-2">
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
        </nft-name>
    </container>
</button>

<style lang="scss">
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
