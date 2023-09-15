<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN_ID, ITokenWithBalance, NotVerifiedStatus, TokenStandard, VerifiedStatus } from '@core/token'
    import { unverifyToken, verifyToken } from '@core/token/stores'
    import { SendFlowType, setSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup, updatePopupProps } from '@desktop/auxiliary/popup'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Button, FontWeight, Text, TextType, TokenAmountTile, TooltipIcon } from '@ui'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { TokenActionsMenu } from '../menus'

    export let token: ITokenWithBalance | undefined
    export let activityId: string = undefined

    function onSkipClick(): void {
        unverifyToken(token.id, NotVerifiedStatus.Skipped)
        if (activityId) {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId },
            })
        } else {
            updatePopupProps({
                token: { ...token, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
            })
        }
    }

    function onVerifyClick(): void {
        verifyToken(token.id, VerifiedStatus.SelfVerified)
        if (activityId) {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId },
            })
        } else {
            updatePopupProps({
                token: { ...token, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
            })
        }
    }

    function onSendClick(): void {
        const sendFlowType = token.id === BASE_TOKEN_ID ? SendFlowType.BaseCoinTransfer : SendFlowType.TokenTransfer
        setSendFlowParameters({
            type: sendFlowType,
            [sendFlowType]: {
                token,
            },
        })

        sendFlowRouter.set(new SendFlowRouter(undefined, SendFlowRoute.SelectRecipient))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

{#if token}
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
                    {token.metadata?.name}
                </Text>
                {#if !token.verification?.verified}
                    <TooltipIcon
                        title={localize('tooltips.tokenIsNotVerified.title')}
                        text={localize('tooltips.tokenIsNotVerified.text')}
                        icon={IconEnum.Info}
                        iconClasses="text-yellow-700"
                    />
                {/if}
            </div>
            {#if token.standard === TokenStandard.Irc30 || token.standard === TokenStandard.Erc20}
                <TokenActionsMenu {token} />
            {/if}
        </div>

        <TokenAmountTile {token} amount={token.balance.available} />
        <Table
            items={[
                {
                    key: localize('popups.tokenInformation.tokenMetadata.standard'),
                    value: token.standard,
                },
                {
                    key: localize('popups.tokenInformation.tokenMetadata.tokenId'),
                    value: token.id,
                    truncate: { firstCharCount: 10, endCharCount: 10 },
                    copyable: true,
                },
                {
                    key: localize('popups.tokenInformation.tokenMetadata.url'),
                    value: token.metadata.standard === TokenStandard.Irc30 ? token.metadata.url : undefined,
                    copyable: true,
                },
                {
                    key: localize('popups.tokenInformation.tokenMetadata.description'),
                    value: token.metadata.standard === TokenStandard.Irc30 ? token.metadata.description : undefined,
                },
            ]}
        />

        {#if !token.verification?.verified && token.verification?.status === NotVerifiedStatus.New}
            <Alert variant="warning" text={localize('popups.tokenInformation.verificationWarning')} />
        {/if}

        <div class="flex flex-row flex-nowrap w-full space-x-4">
            {#if token.verification?.status === NotVerifiedStatus.New}
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
