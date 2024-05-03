<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { TokenActionsMenu } from '@components'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN_ID, ITokenWithBalance, NotVerifiedStatus, TokenStandard, VerifiedStatus } from '@core/token'
    import { unverifyToken, verifyToken } from '@core/token/stores'
    import { SendFlowType, setSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup, updatePopupProps } from '@desktop/auxiliary/popup'
    import { TokenAmountTile } from '@ui'
    import TokenMetadataTable from '@ui/tokens/TokenMetadataTable.svelte'
    import { SendFlowRoute, SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let token: ITokenWithBalance
    export let activityId: string | undefined = undefined

    $: isNewToken = token.verification?.status === NotVerifiedStatus.New

    function onSkipClick(): void {
        unverifyToken(token, NotVerifiedStatus.Skipped)
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
        verifyToken(token, VerifiedStatus.SelfVerified)
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
            sourceNetworkId: token.networkId,
            [sendFlowType]: {
                token,
            },
        })

        sendFlowRouter.set(new SendFlowRouter(SendFlowRoute.SelectRecipient))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

<PopupTemplate
    title={token.metadata?.name}
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
            {#if token.metadata}
                <TokenMetadataTable token={token.metadata} />
            {/if}
            {#if !token.verification?.verified && token.verification?.status === NotVerifiedStatus.New}
                <Alert variant="warning" text={localize('popups.tokenInformation.verificationWarning')} />
            {/if}
        </div>
    {/if}
</PopupTemplate>
