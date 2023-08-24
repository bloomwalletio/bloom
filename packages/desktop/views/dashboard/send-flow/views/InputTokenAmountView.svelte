<script lang="ts">
    import { localize } from '@core/i18n'
    import { IToken, formatTokenAmountDefault, getUnitFromTokenMetadata } from '@core/token'
    import { SendFlowType, sendFlowParameters, updateSendFlowParameters } from '@core/wallet'
    import { TokenAmountInput, TokenAvailableBalanceTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let tokenAmountInput: TokenAmountInput
    let token: IToken
    let rawAmount: string
    let amount: string
    let unit: string
    const tokenKey = $sendFlowParameters.type === SendFlowType.TokenTransfer ? 'tokenTransfer' : 'baseCoinTransfer'

    if (
        $sendFlowParameters.type === SendFlowType.BaseCoinTransfer ||
        $sendFlowParameters.type === SendFlowType.TokenTransfer
    ) {
        token = $sendFlowParameters[tokenKey].token
        rawAmount = $sendFlowParameters[tokenKey].rawAmount
        unit = $sendFlowParameters[tokenKey].unit || getUnitFromTokenMetadata(token?.metadata)
    }

    $: availableBalance = token?.balance?.available

    function setToMax(): void {
        if (token?.metadata?.decimals) {
            amount = formatTokenAmountDefault(availableBalance, token?.metadata, unit, false)
        } else {
            amount = availableBalance.toString() ?? '0'
        }
    }

    async function onContinueClick(): Promise<void> {
        try {
            await tokenAmountInput?.validate()

            updateSendFlowParameters({
                type: $sendFlowParameters.type,
                [tokenKey]: {
                    token,
                    rawAmount,
                    unit,
                },
            })
            $sendFlowRouter.next()
        } catch (err) {
            console.error(err)
        }
    }

    function onBackClick(): void {
        updateSendFlowParameters({
            type: $sendFlowParameters.type,
            [tokenKey]: {
                token,
                rawAmount: undefined,
                unit,
            },
        })
        $sendFlowRouter.previous()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectAmount', {
        values: { tokenName: token.metadata.name },
    })}
    leftButton={{ text: localize('actions.back'), onClick: onBackClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !amount }}
>
    <TokenAmountInput
        bind:this={tokenAmountInput}
        bind:token
        bind:rawAmount
        bind:inputtedAmount={amount}
        {unit}
        {availableBalance}
    />
    <TokenAvailableBalanceTile {token} onMaxClick={setToMax} />
</SendFlowTemplate>
