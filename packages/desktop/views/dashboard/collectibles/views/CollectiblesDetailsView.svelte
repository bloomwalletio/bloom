<script lang="ts">
    import { Alert, type IItem, Table } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, getDefaultExplorerUrl } from '@core/network'
    import { INft, NftDownloadMetadata } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { allAccountNfts, selectedNftId } from '@core/nfts/stores'
    import { getBaseToken } from '@core/profile/actions'
    import { collectiblesRouter } from '@core/router/routers'
    import { formatTokenAmountPrecise } from '@core/token'
    import { getTimeDifference } from '@core/utils'
    import {
        ADDRESS_TYPE_ALIAS,
        ADDRESS_TYPE_ED25519,
        ADDRESS_TYPE_NFT,
        getBech32AddressFromAddressTypes,
        getHexAddressFromAddressTypes,
    } from '@core/wallet'
    import { SendFlowType, setSendFlowParameters } from '@core/wallet/stores'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { Button, CollectibleDetailsMenu, MeatballMenuButton, Modal, NftMedia, Pane, Text } from '@ui'
    import { FontWeight, TextType } from '@ui/enums'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'

    let modal: Modal

    const nft: INft = getNftByIdFromAllAccountNfts($selectedAccountIndex, $selectedNftId)
    const explorerUrl = getDefaultExplorerUrl(nft?.networkId, ExplorerEndpoint.Nft)

    const { id, name, issuer, address, metadata, downloadMetadata, storageDeposit } = nft ?? {}
    const { standard, version, type, uri, description, issuerName, collectionName, attributes, soonaverseAttributes } =
        nft?.parsedMetadata || {}

    const issuerAddress = getBech32AddressFromAddressTypes(issuer)
    const collectionId = getHexAddressFromAddressTypes(issuer)

    let detailsList: IItem[] = []

    $: returnIfNftWasSent($allAccountNfts[$selectedAccountIndex], $time)
    $: timeDiff = getTimeDifference(new Date(nft.timelockTime), $time)
    $: alertText = getAlertText(downloadMetadata)
    $: detailsList = [
        ...(id
            ? [
                  {
                      key: localize('general.nftId'),
                      value: id,
                      copyable: true,
                      truncate: { firstCharCount: 20, endCharCount: 20 },
                  },
              ]
            : []),
        ...(address
            ? [
                  {
                      key: localize('general.address'),
                      value: address,
                      copyable: true,
                      truncate: { firstCharCount: 20, endCharCount: 20 },
                  },
              ]
            : []),
        ...(storageDeposit
            ? [
                  {
                      key: localize('general.storageDeposit'),
                      value: formatTokenAmountPrecise(storageDeposit, getBaseToken()),
                  },
              ]
            : []),
        ...(standard
            ? [
                  {
                      key: localize('general.standard'),
                      value: version ? `${standard} - ${version}` : standard,
                  },
              ]
            : []),
        ...(type
            ? [
                  {
                      key: localize('general.type'),
                      value: type,
                  },
              ]
            : []),
        ...(uri
            ? [
                  {
                      key: localize('general.uri'),
                      value: uri,
                      copyable: true,
                  },
              ]
            : []),
        ...(issuerName
            ? [
                  {
                      key: localize('general.issuer'),
                      value: issuerName,
                  },
              ]
            : []),
        ...(issuer?.type === ADDRESS_TYPE_ED25519
            ? [
                  {
                      key: localize('general.issuerAddress'),
                      value: issuerAddress,
                      copyable: true,
                      truncate: { firstCharCount: 20, endCharCount: 20 },
                  },
              ]
            : []),
        ...(collectionName
            ? [
                  {
                      key: localize('general.collection'),
                      value: collectionName,
                  },
              ]
            : []),
        ...(issuer?.type === ADDRESS_TYPE_NFT || issuer?.type === ADDRESS_TYPE_ALIAS
            ? [
                  {
                      key: localize('general.collectionId'),
                      value: collectionId,
                      copyable: true,
                      truncate: { firstCharCount: 20, endCharCount: 20 },
                  },
              ]
            : []),
        ...(!nft?.parsedMetadata && metadata
            ? [
                  {
                      key: localize('general.metadata'),
                      value: metadata,
                      copyable: true,
                  },
              ]
            : []),
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

<collectibles-details-view class="flex flex-row w-full h-full space-x-4">
    <div class="flex w-full h-auto items-center justify-center overflow-hidden">
        <div class="relative h-auto flex rounded-2xl overflow-hidden">
            <div class="rounded-2xl overflow-hidden flex-1 object-contain h-auto">
                <NftMedia {nft} autoplay controls loop muted />
            </div>
            <div class="absolute right-6 bottom-6 w-auto">
                {#if alertText}
                    <Alert variant={downloadMetadata?.error ? 'danger' : 'warning'} text={alertText} />
                {/if}
            </div>
        </div>
    </div>
    <Pane classes="flex flex-col p-6 space-y-3 w-full h-full max-w-lg">
        <nft-title class="flex justify-between items-center">
            <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="truncate">{name}</Text>
            <MeatballMenuButton onClick={modal?.toggle} />
            <CollectibleDetailsMenu bind:modal {nft} />
        </nft-title>
        {#if description}
            <nft-description class="overflow-scroll">
                <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-700">
                    {description}
                </Text>
            </nft-description>
        {/if}
        <div class="overflow-y-scroll h-full flex flex-col space-y-4 pr-2 -mr-4">
            <nft-details class="flex flex-col space-y-4">
                <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                    {localize('general.details')}
                </Text>
                <Table items={detailsList} />
            </nft-details>
            {#if attributes?.length > 0}
                {@const items = attributes.map(({ trait_type, value }) => ({ key: trait_type, value: String(value) }))}
                <nft-attributes class="flex flex-col space-y-4">
                    <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                        {localize('general.attributes')}
                    </Text>
                    <Table {items} />
                </nft-attributes>
            {:else}
                {#if soonaverseAttributes?.props}
                    {@const items = Object.entries(soonaverseAttributes.props).map(([, { label, value }]) => ({
                        key: label,
                        value,
                    }))}
                    <nft-attributes class="flex flex-col space-y-4">
                        <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                            {localize('general.properties')}
                        </Text>
                        <Table {items} />
                    </nft-attributes>
                {/if}
                {#if soonaverseAttributes?.stats}
                    {@const items = Object.entries(soonaverseAttributes.stats).map(([, { label, value }]) => ({
                        key: label,
                        value,
                    }))}
                    <nft-attributes class="flex flex-col space-y-4">
                        <Text type={TextType.h5} fontWeight={FontWeight.semibold}>
                            {localize('general.statistics')}
                        </Text>
                        <Table {items} />
                    </nft-attributes>
                {/if}
            {/if}
        </div>
        <buttons-container class="flex w-full space-x-4 self-end mt-auto pt-4">
            <Button outline classes="flex-1" onClick={onExplorerClick} disabled={!explorerUrl}>
                {localize('general.viewOnExplorer')}
            </Button>
            <Button classes="flex-1" onClick={onSendClick} disabled={!!timeDiff}>
                {timeDiff
                    ? localize('popups.balanceBreakdown.locked.title') + ' ' + String(timeDiff)
                    : localize('actions.send')}
            </Button>
        </buttons-container>
    </Pane>
</collectibles-details-view>
