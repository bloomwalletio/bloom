<script lang="ts">
    import { Alert, Button, IconName, Table, Text, type IItem } from '@bloomwalletio/ui'
    import { CollectibleDetailsMenu } from '@components'
    import { MediaPlaceholder, NftMedia } from '@ui'
    import { INft, INftAttribute, INftDownloadStatus } from '@core/nfts'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app'

    export let nft: INft
    export let details: IItem[] = []
    export let attributes: INftAttribute[] = []
    export let explorerEndpoint: string

    const { name, description, downloadMetadata } = nft

    $: alertText = getAlertText(downloadMetadata)

    function getAlertText(downloadStatus: INftDownloadStatus): string {
        const { error, warning } = downloadStatus ?? {}
        const errorOrWarning = error || warning

        if (!errorOrWarning) {
            return
        }

        const { type, message } = errorOrWarning
        return type === 'generic' ? message : localize(`error.nft.${type}.long`)
    }

    function onExplorerClick(): void {
        openUrlInBrowser(explorerEndpoint)
    }

    function onSendClick(): void {}
</script>

<collectibles-details-view class="flex flex-row w-full h-full">
    <media-container class="relative flex w-full items-center justify-center p-5 overflow-hidden">
        <NftMedia {nft} autoplay controls loop muted>
            <div class="w-full h-full" slot="placeholder">
                <MediaPlaceholder {nft} size="lg" />
            </div>
        </NftMedia>
        {#if alertText}
            <error-container>
                <Alert variant={downloadMetadata?.error ? 'danger' : 'warning'} text={alertText} border />
            </error-container>
        {/if}
    </media-container>
    <details-container class="flex flex-col px-6 py-8 space-y-3 w-full h-full max-w-sm">
        <nft-title class="flex justify-between items-center gap-4">
            <Text type="h4" truncate>{name}</Text>
            <CollectibleDetailsMenu {nft} />
        </nft-title>
        {#if description}
            <nft-description class="overflow-scroll">
                <Text type="body1">{localize('general.description')}</Text>
                <Text textColor="secondary">{description}</Text>
            </nft-description>
        {/if}
        <div class="overflow-y-scroll h-full flex flex-col space-y-4 pr-2 -mr-4">
            <details-list>
                <Table items={details} />
            </details-list>
            {#if attributes?.length > 0}
                {@const items = attributes.map(({ trait_type, value }) => ({
                    key: trait_type,
                    value: String(value),
                }))}
                <nft-attributes class="flex flex-col space-y-4">
                    <Text type="body1">{localize('general.attributes')}</Text>
                    <Table {items} />
                </nft-attributes>
            {/if}
        </div>
        <buttons-container class="flex w-full space-x-4 self-end mt-auto pt-4">
            <Button
                text={localize('general.viewOnExplorer')}
                on:click={onExplorerClick}
                disabled={!explorerEndpoint}
                variant="outlined"
                width="half"
            />
            <Button
                text={localize('actions.send')}
                icon={IconName.Send}
                on:click={onSendClick}
                disabled={true}
                width="half"
                reverse
            />
        </buttons-container>
    </details-container>
</collectibles-details-view>

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
