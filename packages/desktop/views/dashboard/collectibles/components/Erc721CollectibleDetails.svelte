<script lang="ts">
    import { MediaPlaceholder, NetworkLabel, NftMedia } from '@ui'
    import { CollectibleDetailsMenu } from '@components'
    import { Alert, Button, IconName, Table, Text, type IItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IErc721Nft, INftDownloadStatus } from '@core/nfts'
    import { ExplorerEndpoint, getDefaultExplorerUrl } from '@core/network'

    export let nft: IErc721Nft

    const { standard, address, networkId, description, metadata, tokenId, downloadMetadata } = nft
    const explorerUrl = getDefaultExplorerUrl(networkId, ExplorerEndpoint.Nft)

    $: alertText = getAlertText(downloadMetadata)

    let detailsList: IItem[] = []
    $: detailsList = [
        {
            key: localize('general.network'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId,
                },
            },
        },
        {
            key: localize('general.address'),
            value: address || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.tokenId'),
            value: tokenId,
        },
        {
            key: localize('general.standard'),
            value: standard,
        },
        {
            key: localize('general.collection'),
            value: metadata.contract.name || undefined,
        },
        {
            key: localize('general.metadata'),
            value: !nft?.metadata && metadata ? metadata : undefined,
            copyable: true,
        },
    ]

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
        // console.log('opening explorer')
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
                <Table items={detailsList} />
            </details-list>
            {#if metadata.token.attributes?.length > 0}
                {@const items = metadata.token.attributes.map(({ traitType, value }) => ({
                    key: traitType,
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
                disabled={!explorerUrl}
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
