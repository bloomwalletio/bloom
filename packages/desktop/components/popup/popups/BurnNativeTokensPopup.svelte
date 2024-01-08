<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { TokenAmountWithSliderInput } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let token: ITokenWithBalance
    export let rawAmount: bigint = BigInt(0)

    let tokenAmountInput: TokenAmountWithSliderInput
    let amount: string

    function onContinueClick(): void {
        try {
            tokenAmountInput.validate()
            openPopup({
                id: PopupId.BurnNativeTokensConfirmation,
                props: { token, rawAmount },
            })
        } catch (err) {
            console.error(err)
        }
    }
</script>

<PopupTemplate
    title={localize('actions.confirmTokenBurn.title', {
        values: {
            assetName: token?.metadata?.name,
        },
    })}
    backButton={{
        text: localize('actions.cancel'),
        onClick: closePopup,
    }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: amount === '' || amount === '0' || amount === undefined,
    }}
>
    <div class="space-y-5">
        <TokenAmountWithSliderInput bind:this={tokenAmountInput} bind:inputtedAmount={amount} bind:rawAmount {token} />
        <Alert variant="warning" text={localize('actions.confirmTokenBurn.hint')} />
    </div>
</PopupTemplate>
