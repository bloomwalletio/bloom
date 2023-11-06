<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        BASE_TOKEN_ID,
        ITokenWithBalance,
        formatTokenAmountDefault,
        formatTokenAmountBestMatch,
        getUnitFromTokenMetadata,
    } from '@core/token'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import {
        SendFlowParameters,
        SendFlowType,
        getNetworkIdFromSendFlowParameters,
        sendFlowParameters,
        updateSendFlowParameters,
    } from '@core/wallet'
    import { TokenAmountInput, TokenAvailableBalanceTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import { PopupTemplate } from '@components'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'
    import { Table } from '@bloomwalletio/ui'
    import { getBaseToken } from '@core/profile/actions'
    import { setGasFee } from '@core/layer-2/actions'
    import { isEvmChain } from '@core/network'

    let tokenAmountInput: TokenAmountInput
    let token: ITokenWithBalance
    let rawAmount: string
    let amount: string
    let unit: string

    const showGasFee =
        isEvmChain($sendFlowParameters.destinationNetworkId) ||
        isEvmChain(getNetworkIdFromSendFlowParameters($sendFlowParameters))
    const sendFlowType = $sendFlowParameters.type
    if (sendFlowType === SendFlowType.BaseCoinTransfer || sendFlowType === SendFlowType.TokenTransfer) {
        token = getTokenFromSelectedAccountTokens(
            $sendFlowParameters[sendFlowType].token?.id,
            $sendFlowParameters[sendFlowType].token?.networkId
        )
        rawAmount = $sendFlowParameters[sendFlowType].rawAmount
        unit = $sendFlowParameters[sendFlowType].unit || getUnitFromTokenMetadata(token?.metadata)
    }

    $: gasFee = Number($sendFlowParameters.gasFee ?? 0)
    $: available = token.balance.available - (token.id === BASE_TOKEN_ID ? gasFee : 0)

    function setToMax(): void {
        if (token?.metadata?.decimals) {
            amount = formatTokenAmountDefault(token.balance.available - gasFee, token?.metadata, unit, false)
        } else {
            amount = (token.balance.available - gasFee).toString() ?? '0'
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
            gasFee: 0,
        })
        $sendFlowRouter.previous()
    }

    let fetchingGasFee = true
    async function _onMount(): Promise<void> {
        const tempSendFlowParams: SendFlowParameters = {
            ...$sendFlowParameters,
            [sendFlowType]: {
                token,
                rawAmount: token.balance.available.toString(),
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
    <TokenAvailableBalanceTile token={{ ...token, balance: { ...token.balance, available } }} onMaxClick={setToMax} />

    {#if showGasFee}
        <div class={fetchingGasFee ? 'animate-pulse' : ''}>
            <Table
                items={[
                    {
                        key: localize('general.transactionFee'),
                        value: formatTokenAmountBestMatch(gasFee, getBaseToken()),
                    },
                ]}
            />
        </div>
    {/if}
</PopupTemplate>
