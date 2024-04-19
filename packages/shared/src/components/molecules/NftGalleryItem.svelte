<script lang="typescript">
    import { Icon, IconName, Pill, Text, Tooltip, type TextColor } from '@bloomwalletio/ui'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { IDownloadMetadata, Nft, isIrc27Nft, isNftLocked } from '@core/nfts'
    import { downloadingNftId, selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { getTimeDifference } from '@core/utils'
    import { MediaPlaceholder, NetworkAvatar, NftMedia } from '@ui'

    export let nft: Nft

    let nftWrapperClientWidth: number
    let anchor: HTMLElement

    $: isLocked = isNftLocked(nft)

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
                <Pill color="neutral" compact>{nft.standard}</Pill>
                {#if isIrc27Nft(nft)}
                    {#if nft.expirationTime}
                        {@const expirationTimeDiffText = getTimeDifference(new Date(nft.expirationTime), $time)}
                        <Pill color="warning" compact>
                            <div class="flex flex-row items-center gap-1">
                                <Icon name={IconName.Hourglass} size="xxs" customColor="warning" />
                                <div>{expirationTimeDiffText}</div>
                            </div>
                        </Pill>
                    {/if}
                    {#if isLocked}
                        {@const timeLockDiff = getTimeDifference(new Date(nft.timelockTime ?? 0), $time)}
                        <Pill color="neutral" compact>
                            <div class="flex flex-row items-center gap-1">
                                <Icon name={IconName.Locked} size="xxs" textColor="secondary" />
                                <div>{timeLockDiff}</div>
                            </div>
                        </Pill>
                    {/if}
                {/if}
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
