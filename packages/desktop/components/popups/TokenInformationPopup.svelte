<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        TokenStandard,
        IAsset,
        resetNewTokenTransactionDetails,
        updateNewTransactionDetails,
        unverifyAsset,
        verifyAsset,
        NotVerifiedStatus,
        VerifiedStatus,
        NewTransactionType,
    } from '@core/wallet'
    import { openPopup, PopupId, updatePopupProps } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { Button, Text, TextHint, AssetActionsButton, FontWeight, TextType, TokenAmountTile, TooltipIcon } from '@ui'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Table } from '@bloom-labs/ui'

    export let asset: IAsset
    export let activityId: string = undefined

    function getTableItems(asset: IAsset) {
        const items = [
            {
                key: localize('popups.tokenInformation.tokenMetadata.standard'),
                value: asset.standard,
            },
            {
                key: localize('popups.tokenInformation.tokenMetadata.name'),
                value: asset.metadata?.name,
            },
            {
                key: localize('popups.tokenInformation.tokenMetadata.tokenId'),
                value: asset.id,
            },
        ]

        if (asset.metadata?.standard === TokenStandard.Irc30 && asset.metadata.url) {
            items.push({
                key: localize('popups.tokenInformation.tokenMetadata.url'),
                value: asset.metadata.url,
            })
        }

        return items
    }

    function onSkipClick(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        if (activityId) {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId },
            })
        } else {
            updatePopupProps({
                asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
            })
        }
    }

    function onVerifyClick(): void {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        if (activityId) {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId },
            })
        } else {
            updatePopupProps({
                asset: { ...asset, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
            })
        }
    }

    function onSendClick(): void {
        resetNewTokenTransactionDetails()
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            asset: asset,
            disableAssetSelection: true,
        })
        sendFlowRouter.set(new SendFlowRouter(undefined, SendFlowRoute.SelectRecipient))
        openPopup({
            id: features.wallet.newSendFlow.enabled ? PopupId.SendFlow : PopupId.SendForm,
            overflow: true,
        })
    }
</script>

{#if asset}
    <div class="space-y-6">
        <div class="flex flex-row justify-between items-center space-x-3 mr-8">
            <div class="flex flex-row items-center space-x-2">
                <Text
                    type={TextType.h4}
                    fontSize="18"
                    lineHeight="6"
                    fontWeight={FontWeight.semibold}
                    classes="overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    {asset.metadata?.name}
                </Text>
                {#if !asset.verification?.verified}
                    <TooltipIcon
                        title={localize('tooltips.tokenIsNotVerified.title')}
                        text={localize('tooltips.tokenIsNotVerified.text')}
                        icon={IconEnum.Info}
                        iconClasses="text-yellow-700"
                    />
                {/if}
            </div>
            {#if asset.standard === TokenStandard.Irc30}
                <AssetActionsButton {asset} />
            {/if}
        </div>

        <TokenAmountTile {asset} amount={asset.balance.available} />

        <Table orientation="vertical" items={getTableItems(asset)} />

        {#if !asset.verification?.verified && asset.verification?.status === NotVerifiedStatus.New}
            <TextHint warning text={localize('popups.tokenInformation.verificationWarning')} />
        {/if}

        <div class="flex flex-row flex-nowrap w-full space-x-4">
            {#if asset.verification?.status === NotVerifiedStatus.New}
                <Button outline classes="w-full" onClick={onSkipClick}>
                    {localize('actions.skip')}
                </Button>
                <Button classes="w-full" onClick={onVerifyClick}>
                    {localize('popups.tokenInformation.buttons.verifyToken')}
                </Button>
            {:else}
                <Button classes="w-full" onClick={onSendClick}>
                    {localize('actions.send')}
                </Button>
            {/if}
        </div>
    </div>
{/if}
