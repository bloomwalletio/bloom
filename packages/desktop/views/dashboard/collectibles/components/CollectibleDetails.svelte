<script lang="ts">
    import { Alert, Button, IconName, Link, Table, Text, type IItem, type TextColor } from '@bloomwalletio/ui'
    import { CollectibleDetailsMenu } from '@components'
    import { openUrlInBrowser } from '@core/app'
    import { time } from '@core/app/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { INftAttribute, Nft, NftStandard } from '@core/nfts'
    import { addNftsToDownloadQueue } from '@core/nfts/actions'
    import { downloadingNftId, updatePersistedNft } from '@core/nfts/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { getTimeDifference } from '@core/utils'
    import { burnNft, claimActivity } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import { MediaPlaceholder, NftMedia } from '@ui'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { SendFlowType, setSendFlowParameters } from 'shared/src/lib/core/wallet'
    import NftMediaAlert from './NftMediaAlert.svelte'
    import {
        StardustActivityAsyncStatus,
        StardustNftActivity,
        getClaimableActivities,
        selectedAccountActivities,
    } from '@core/activity'
    import { selectedAccount } from '@core/account/stores'

    export let nft: Nft
    export let details: IItem[] = []
    export let attributes: INftAttribute[] = []
    export let explorerEndpoint: string | undefined

    interface IContinueButtonProps {
        text: string
        icon?: IconName
        onClick: () => void
    }

    $: continueButtonProps = setContinueButtonProps(nft)

    const nftActivity = getNftActivity()
    $: activity =
        nftActivity &&
        ($selectedAccountActivities.find((_activity) => _activity.id === nftActivity?.id) as StardustNftActivity)

    $: timeDiff =
        nft.standard === NftStandard.Irc27 && nft.timelockTime
            ? getTimeDifference(new Date(nft.timelockTime), $time)
            : undefined

    $: isClaiming =
        nft.standard === NftStandard.Irc27 && Boolean(activity?.asyncData?.isClaiming) && Boolean(nft.expirationTime)
    $: isContinueButtonDisabled = !!timeDiff || isClaiming

    $: placeHolderColor = nft.downloadMetadata?.error
        ? 'danger'
        : nft.downloadMetadata?.warning
          ? 'warning'
          : ('brand' as TextColor)

    function setContinueButtonProps(nft: Nft): IContinueButtonProps {
        if (nft.isScam) {
            return {
                text: localize('actions.burn'),
                icon: IconName.Trash,
                onClick: onBurnClick,
            }
        } else if (
            nft.standard === NftStandard.Irc27 &&
            nft.expirationTime &&
            activity?.asyncData?.asyncStatus === StardustActivityAsyncStatus.Unclaimed
        ) {
            return {
                text: localize('actions.claim'),
                onClick: onClaimClick,
            }
        } else {
            return {
                text: localize('actions.send'),
                icon: IconName.Send,
                onClick: onSendClick,
            }
        }
    }

    function onExplorerClick(): void {
        openUrlInBrowser(explorerEndpoint)
    }

    function onSendClick(): void {
        setSendFlowParameters({
            type: SendFlowType.NftTransfer,
            sourceNetworkId: nft.networkId,
            nft,
            recipient: undefined,
        })
        sendFlowRouter.set(new SendFlowRouter(SendFlowRoute.SelectRecipient))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }

    function getNftActivity(): StardustNftActivity | undefined {
        const claimableActivites = getClaimableActivities()
        return claimableActivites.find(
            (activity) => (activity as StardustNftActivity).nftId === nft.id
        ) as StardustNftActivity
    }

    function onClaimClick(): void {
        const nftActivity = getNftActivity()
        if (!nftActivity) {
            return
        }
        void claimActivity(nftActivity, $selectedAccount)
    }

    function onNotAScamClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.notAScam.title'),
                description: localize('popups.notAScam.description'),
                alert: { variant: 'warning', text: localize('error.nft.scamNft.long') },
                confirmText: localize('actions.confirm'),
                variant: 'danger',
                onConfirm: () => {
                    nft.isScam = false
                    updatePersistedNft(nft.id, { isScam: false })
                    addNftsToDownloadQueue([nft])
                    closePopup()
                },
            },
        })
    }

    function onBurnClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                variant: 'danger',
                title: localize('actions.confirmNftBurn.title', {
                    values: {
                        nftName: nft.name,
                    },
                }),
                description: localize('actions.confirmNftBurn.description'),
                alert: { variant: 'warning', text: localize('actions.confirmNftBurn.hint') },
                confirmText: localize('actions.burn'),
                onConfirm: async () => {
                    try {
                        await burnNft(nft.id)
                        $collectiblesRouter?.goTo(CollectiblesRoute.Gallery)
                        closePopup()
                    } catch (error) {
                        handleError(error)
                    }
                },
            },
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
        {#if nft.downloadMetadata?.error || nft.downloadMetadata?.warning}
            <error-container>
                <NftMediaAlert
                    type={nft.downloadMetadata?.error?.type ?? nft.downloadMetadata?.warning?.type}
                    message={nft.downloadMetadata?.error?.message ?? nft.downloadMetadata?.warning?.message}
                    downloadMetadata={nft.downloadMetadata}
                    {nft}
                />
            </error-container>
        {/if}
    </media-container>
    <details-container class="flex flex-col px-6 py-8 space-y-3 w-full h-full max-w-sm">
        <nft-title class="flex justify-between items-center gap-4">
            <Text type="h4" truncate>{nft.name}</Text>
            <CollectibleDetailsMenu {nft} burnNft={onBurnClick} />
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
        <footer class="flex flex-col space-y-4 self-end items-end justify-end w-full">
            {#if nft.isScam}
                <Alert variant="danger">
                    <div slot="text">
                        <Text type="base" fontWeight="medium"
                            >{localize('error.nft.scamNft.long')}
                            <Link
                                fontWeight="medium"
                                on:click={onNotAScamClick}
                                text={localize('popups.notAScam.title')}
                            /></Text
                        >
                    </div>
                </Alert>
            {/if}
            <buttons-container class="flex flex-row w-full space-x-4 mt-auto">
                <Button
                    text={localize('general.viewOnExplorer')}
                    on:click={onExplorerClick}
                    disabled={!explorerEndpoint}
                    variant="outlined"
                    width="half"
                />
                <Button
                    text={continueButtonProps.text}
                    icon={continueButtonProps.icon}
                    color={nft.isScam ? 'danger' : 'primary'}
                    on:click={continueButtonProps.onClick}
                    disabled={isContinueButtonDisabled}
                    busy={isClaiming}
                    busyText={localize('actions.claiming')}
                    width="half"
                    reverse
                />
            </buttons-container>
        </footer>
    </details-container>
</collectibles-details-view>

<style lang="postcss">
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
