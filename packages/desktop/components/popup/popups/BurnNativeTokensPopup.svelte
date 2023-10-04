<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { Button, FontWeight, Text, TextType, TokenAmountWithSliderInput } from '@ui'

    export let token: ITokenWithBalance
    export let rawAmount: string = '0'

    let tokenAmountInput: TokenAmountWithSliderInput

    async function onContinueClick(): Promise<void> {
        try {
            await tokenAmountInput.validate()
            openPopup({
                id: PopupId.BurnNativeTokensConfirmation,
                props: { token, rawAmount },
            })
        } catch (err) {
            console.error(err)
        }
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('actions.confirmTokenBurn.title', {
            values: {
                assetName: token?.metadata?.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <TokenAmountWithSliderInput bind:this={tokenAmountInput} bind:rawAmount {token} />
        <Alert variant="warning" text={localize('actions.confirmTokenBurn.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onContinueClick}>{localize('actions.continue')}</Button>
    </popup-buttons>
</div>
