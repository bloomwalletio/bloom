<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        TokenStandard,
        IAsset,
        setSendFlowParameters,
        unverifyAsset,
        verifyAsset,
        NotVerifiedStatus,
        VerifiedStatus,
        SendFlowType,
    } from '@core/wallet'
    import { openPopup, PopupId, updatePopupProps } from '@desktop/auxiliary/popup'
    import {
        Button,
        Text,
        TextHint,
        AssetActionsButton,
        KeyValueBox,
        FontWeight,
        TextType,
        TokenAmountTile,
        TooltipIcon,
    } from '@ui'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { getCoinType } from '@core/profile'

    export let asset: IAsset
    export let activityId: string = undefined

    $: showAssetActionsMenuButton = asset.standard === TokenStandard.Irc30 || asset.standard === TokenStandard.Erc20

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
        const sendFlowType = asset.id === getCoinType() ? SendFlowType.BaseCoinTransfer : SendFlowType.TokenTransfer
        setSendFlowParameters({
            type: sendFlowType,
            [sendFlowType === SendFlowType.BaseCoinTransfer ? 'baseCoinTransfer' : 'tokenTransfer']: {
                asset: asset,
            },
        })

        sendFlowRouter.set(new SendFlowRouter(undefined, SendFlowRoute.SelectRecipient))
        openPopup({
            id: PopupId.SendFlow,
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
            {#if showAssetActionsMenuButton}
                <AssetActionsButton {asset} />
            {/if}
        </div>

        <TokenAmountTile {asset} amount={asset.balance.available} />

        <div class="space-y-4 flex flex-col items-center justify-center">
            <div class="w-full flex flex-col space-y-2">
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.standard')}
                    valueText={asset.standard}
                />
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.name')}
                    valueText={asset.metadata?.name}
                />
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.tokenId')}
                    valueText={asset.id}
                    isCopyable={asset.standard === TokenStandard.Irc30}
                    copyValue={asset.id}
                />
                {#if asset.metadata?.standard === TokenStandard.Irc30 && asset.metadata.url}
                    <KeyValueBox
                        keyText={localize('popups.tokenInformation.tokenMetadata.url')}
                        valueText={asset.metadata.url}
                        isCopyable
                    />
                {/if}
            </div>
        </div>

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
