<script lang="ts">
    import { Alert, Button, IconName, Table, Text, type IItem, type TextColor } from '@bloomwalletio/ui'
    import { CollectibleDetailsMenu } from '@components'
    import { MediaPlaceholder, NftMedia } from '@ui'
    import { IDownloadMetadata, Nft, INftAttribute, NftStandard } from '@core/nfts'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app'
    import { getTimeDifference } from '@core/utils'
    import { time } from '@core/app/stores'
    import { SendFlowType, setSendFlowParameters } from 'shared/src/lib/core/wallet'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { downloadingNftId } from '@core/nfts/stores'

    export let nft: Nft
    export let details: IItem[] = []
    export let attributes: INftAttribute[] = []
    export let explorerEndpoint: string | undefined

    $: timeDiff = nft.standard === NftStandard.Irc27 ? getTimeDifference(new Date(nft.timelockTime), $time) : undefined
    $: alertText = getAlertText(nft.downloadMetadata)
    $: isSendButtonDisabled = !!timeDiff

    $: placeHolderColor = nft.downloadMetadata?.error
        ? 'danger'
        : nft.downloadMetadata?.warning
          ? 'warning'
          : ('brand' as TextColor)

    function getAlertText(downloadMetadata: IDownloadMetadata | undefined): string | undefined {
        const { error, warning } = downloadMetadata ?? {}
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

    function onSendClick(): void {
        setSendFlowParameters({
            type: SendFlowType.NftTransfer,
            nft,
            recipient: undefined,
        })
        sendFlowRouter.set(new SendFlowRouter(SendFlowRoute.SelectRecipient))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

<collectibles-details-view class="flex flex-row w-full h-full">
    <media-container class="relative flex w-full items-center justify-center p-5 overflow-hidden">
        <NftMedia {nft} autoplay controls loop muted>
            <div class="w-full h-full" slot="placeholder">
                <MediaPlaceholder
                    type={nft?.type}
                    textColor={placeHolderColor}
                    downloading={$downloadingNftId === nft?.id}
                    size="lg"
                />
            </div>
        </NftMedia>
        {#if alertText}
            <error-container>
                <Alert variant={nft.downloadMetadata?.error ? 'danger' : 'warning'} text={alertText} border />
            </error-container>
        {/if}
    </media-container>
    <details-container class="flex flex-col px-6 py-8 space-y-3 w-full h-full max-w-sm">
        <nft-title class="flex justify-between items-center gap-4">
            <Text type="h4" truncate>{nft.name}</Text>
            <CollectibleDetailsMenu {nft} />
        </nft-title>
        {#if nft.description}
            <Text type="body1">{localize('general.description')}</Text>
            <nft-description>
                <Text textColor="secondary">{nft.description}</Text>
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
                disabled={isSendButtonDisabled}
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

    nft-description {
        @apply overflow-scroll shrink-0;
        max-height: 8rem;
    }
</style>
