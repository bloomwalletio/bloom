<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN_ID, ITokenWithBalance, NotVerifiedStatus, TokenStandard, VerifiedStatus } from '@core/token'
    import { unverifyToken, verifyToken } from '@core/token/stores'
    import { SendFlowType, setSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup, updatePopupProps } from '@desktop/auxiliary/popup'
    import { TokenAmountTile } from '@ui'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { TokenActionsMenu } from '@components'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { truncateString } from '@core/utils'
    import { selectedAccountActivities } from '@core/activity'
    import { NetworkNamespace } from '@core/network'

    export let token: ITokenWithBalance | undefined
    export let activityId: string = undefined

    $: isNewToken = token.verification?.status === NotVerifiedStatus.New
    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: popupId =
        activity.namespace === NetworkNamespace.Evm
            ? PopupId.EvmActivityDetails
            : activity.namespace === NetworkNamespace.Stardust
              ? PopupId.StardustActivityDetails
              : undefined

    function onSkipClick(): void {
        unverifyToken(token.id, NotVerifiedStatus.Skipped)
        if (activity && popupId) {
            openPopup({
                id: popupId,
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
        if (activity && popupId) {
            openPopup({
                id: popupId,
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

<PopupTemplate
    title={truncateString(token.metadata?.name, 16, 0)}
    backButton={isNewToken
        ? {
              text: localize('actions.skip'),
              onClick: onSkipClick,
          }
        : undefined}
    continueButton={{
        text: isNewToken ? localize('popups.tokenInformation.buttons.verifyToken') : localize('actions.send'),
        onClick: isNewToken ? onVerifyClick : onSendClick,
    }}
>
    <div slot="menu">
        {#if token.standard === TokenStandard.Irc30 || token.standard === TokenStandard.Erc20}
            <TokenActionsMenu {token} />
        {/if}
    </div>
    {#if token}
        <div class="space-y-5">
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
        </div>
    {/if}
</PopupTemplate>
