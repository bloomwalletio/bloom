<script lang="ts">
    import { localize } from '@core/i18n'
    import { BASE_TOKEN_ID, ITokenWithBalance, formatTokenAmount, getUnitFromTokenMetadata } from '@core/token'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { SendFlowParameters, SendFlowType, sendFlowParameters, updateSendFlowParameters } from '@core/wallet'
    import { TokenAmountInput, TokenAvailableBalanceTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import { PopupTemplate } from '@components'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'
    import { setGasFee } from '@core/layer-2/actions'

    let tokenAmountInput: TokenAmountInput
    let token: ITokenWithBalance
    let rawAmount: bigint
    let amount: string
    let unit: string

    const sendFlowType = $sendFlowParameters.type
    if (sendFlowType === SendFlowType.BaseCoinTransfer || sendFlowType === SendFlowType.TokenTransfer) {
        token = getTokenFromSelectedAccountTokens(
            $sendFlowParameters[sendFlowType].token?.id,
            $sendFlowParameters[sendFlowType].token?.networkId
        )
        rawAmount = $sendFlowParameters[sendFlowType].rawAmount
        unit = $sendFlowParameters[sendFlowType].unit || getUnitFromTokenMetadata(token?.metadata)
    }

    $: gasFee = $sendFlowParameters.gasFee ?? BigInt(0)
    $: available = token.balance.available - (token.id === BASE_TOKEN_ID ? gasFee : BigInt(0))

    function setToMax(): void {
        if (fetchingGasFee) {
            return
        }
        const available = token.id === BASE_TOKEN_ID ? token.balance.available - gasFee : token.balance.available
        if (token?.metadata?.decimals) {
            amount = formatTokenAmount(available, token?.metadata, { withUnit: false, round: false })
        } else {
            amount = available.toString() ?? '0'
        }
    }

    async function onContinueClick(): Promise<void> {
        try {
            await tokenAmountInput?.validate()

            updateSendFlowParameters({
                type: $sendFlowParameters.type,
                [sendFlowType]: {
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
            [sendFlowType]: {
                token,
                rawAmount: undefined,
                unit,
            },
            gasFee: BigInt(0),
        })
        $sendFlowRouter.previous()
    }

    let fetchingGasFee = true
    async function _onMount(): Promise<void> {
        const tempSendFlowParams: SendFlowParameters = {
            ...$sendFlowParameters,
            [sendFlowType]: {
                token,
                rawAmount: token.balance.available,
                unit,
            },
        }
        await setGasFee(tempSendFlowParams, $selectedAccount)
        fetchingGasFee = false
    }

    onMount(() => {
        void _onMount()
    })
</script>

<PopupTemplate
    title={localize('popups.transaction.selectAmount', {
        values: { tokenName: token.metadata.name },
    })}
    backButton={{ text: localize('actions.back'), onClick: onBackClick }}
    continueButton={{
        form: 'token-amount-form',
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !amount,
    }}
>
    <form on:submit|preventDefault={onContinueClick} id="token-amount-form" class="flex flex-col gap-6">
        <TokenAmountInput
            bind:this={tokenAmountInput}
            bind:token
            bind:rawAmount
            bind:inputtedAmount={amount}
            {unit}
            availableBalance={token?.balance?.available}
        />
    </form>
    <div class={fetchingGasFee ? 'animate-pulse' : ''}>
        <TokenAvailableBalanceTile
            token={{ ...token, balance: { ...token.balance, available } }}
            onMaxClick={setToMax}
        />
    </div>
</PopupTemplate>
