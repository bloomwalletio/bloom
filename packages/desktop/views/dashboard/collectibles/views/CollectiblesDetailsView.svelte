<script lang="ts">
    import { Alert, Button, IconName, Table, Text, type IItem } from '@bloomwalletio/ui'
    import { CollectibleDetailsMenu } from '@components'
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, getActiveNetworkId, getDefaultExplorerUrl } from '@core/network'
    import { INft, NftDownloadMetadata } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { allAccountNfts, selectedNftId } from '@core/nfts/stores'
    import { getBaseToken } from '@core/profile/actions'
    import { collectiblesRouter } from '@core/router/routers'
    import { formatTokenAmountPrecise } from '@core/token'
    import { getTimeDifference } from '@core/utils'
    import { SendFlowType, getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes } from '@core/wallet'
    import { setSendFlowParameters } from '@core/wallet/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { AddressType } from '@iota/sdk/out/types'
    import { MediaPlaceholder, NetworkLabel, NftMedia, Pane } from '@ui'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'

    const nft: INft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)
    // We don't use `nft.networkId` on this one, as for IRC27 nfts we still want the L1 explorer
    const explorerUrl = getDefaultExplorerUrl(getActiveNetworkId(), ExplorerEndpoint.Nft)

    const { id, name, issuer, address, metadata, downloadMetadata, storageDeposit } = nft ?? {}
    const { standard, version, description, issuerName, collectionName, attributes, soonaverseAttributes } =
        nft?.parsedMetadata || {}

    const issuerAddress = getBech32AddressFromAddressTypes(issuer)
    const collectionId = getHexAddressFromAddressTypes(issuer)

    $: returnIfNftWasSent($allAccountNfts[$selectedAccountIndex], $time)
    $: timeDiff = getTimeDifference(new Date(nft.timelockTime), $time)
    $: alertText = getAlertText(downloadMetadata)

    let detailsList: IItem[] = []
    $: detailsList = [
        {
            key: localize('general.network'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId: nft.networkId,
                },
            },
        },
        {
            key: localize('general.nftId'),
            value: id || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.address'),
            value: address || undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.storageDeposit'),
            value: storageDeposit ? formatTokenAmountPrecise(storageDeposit, getBaseToken()) : undefined,
        },
        {
            key: localize('general.standard'),
            value: version ? `${standard} - ${version}` : standard,
        },
        {
            key: localize('general.issuer'),
            value: issuerName || undefined,
        },
        {
            key: localize('general.issuerAddress'),
            value: issuer?.type === AddressType.Ed25519 ? issuerAddress : undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.collection'),
            value: collectionName || undefined,
        },
        {
            key: localize('general.collectionId'),
            value: issuer?.type === AddressType.Nft || issuer?.type === AddressType.Alias ? collectionId : undefined,
            copyable: true,
            truncate: { firstCharCount: 15, endCharCount: 15 },
        },
        {
            key: localize('general.metadata'),
            value: !nft?.parsedMetadata && metadata ? metadata : undefined,
            copyable: true,
        },
    ]

    function returnIfNftWasSent(ownedNfts: INft[], currentTime: Date): void {
        const nft = ownedNfts.find((nft) => nft.id === id)
        const isLocked = nft.timelockTime > currentTime.getTime()
        if (nft?.isSpendable || isLocked) {
            // empty
        } else {
            $collectiblesRouter.previous()
        }
    }

    function onExplorerClick(): void {
        openUrlInBrowser(`${explorerUrl}/${id}`)
    }

    function onSendClick(): void {
        setSendFlowParameters({
            type: SendFlowType.NftTransfer,
            nft,
            recipient: undefined,
        })
        sendFlowRouter.set(new SendFlowRouter(undefined, SendFlowRoute.SelectRecipient))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }

    function getAlertText(downloadMetadata: NftDownloadMetadata): string {
        const { error, warning } = downloadMetadata ?? {}
        const errorOrWarning = error || warning

        if (!errorOrWarning) {
            return
        }

        const { type, message } = errorOrWarning
        return type === 'generic' ? message : localize(`error.nft.${type}.long`)
    }
</script>

<Pane classes="h-full">
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
                {#if attributes?.length > 0}
                    {@const items = attributes.map(({ trait_type, value }) => ({
                        key: trait_type,
                        value: String(value),
                    }))}
                    <nft-attributes class="flex flex-col space-y-4">
                        <Text type="body1">{localize('general.attributes')}</Text>
                        <Table {items} />
                    </nft-attributes>
                {:else}
                    {#if soonaverseAttributes?.props}
                        {@const items = Object.entries(soonaverseAttributes.props).map(([, { label, value }]) => ({
                            key: label,
                            value,
                        }))}
                        <nft-attributes class="flex flex-col space-y-4">
                            <Text type="body1">{localize('general.properties')}</Text>
                            <Table {items} />
                        </nft-attributes>
                    {/if}
                    {#if soonaverseAttributes?.stats}
                        {@const items = Object.entries(soonaverseAttributes.stats).map(([, { label, value }]) => ({
                            key: label,
                            value,
                        }))}
                        <nft-attributes class="flex flex-col space-y-4">
                            <Text type="body1">{localize('general.statistics')}</Text>
                            <Table {items} />
                        </nft-attributes>
                    {/if}
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
                    text={timeDiff
                        ? localize('popups.balanceBreakdown.locked.title') + ' ' + String(timeDiff)
                        : localize('actions.send')}
                    icon={IconName.Send}
                    on:click={onSendClick}
                    disabled={!!timeDiff}
                    width="half"
                    reverse
                />
            </buttons-container>
        </details-container>
    </collectibles-details-view>
</Pane>

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
