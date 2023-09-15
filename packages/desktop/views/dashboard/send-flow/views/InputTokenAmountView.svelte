<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        BASE_TOKEN_ID,
        ITokenWithBalance,
        formatTokenAmountDefault,
        formatTokenAmountPrecise,
        getUnitFromTokenMetadata,
    } from '@core/token'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import {
        SendFlowParameters,
        SendFlowType,
        createEvmTransactionFromSendFlowParameters,
        getNetworkIdFromSendFlowParameters,
        sendFlowParameters,
        updateSendFlowParameters,
    } from '@core/wallet'
    import { TokenAmountInput, TokenAvailableBalanceTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { onMount } from 'svelte'
    import { isEvmChain } from '@core/network/utils'
    import { getNetwork } from '@core/network/stores'
    import { selectedAccount } from '@core/account/stores'
    import { calculateMaxGasFeeFromTransactionData } from '@core/layer-2/utils'
    import { Table } from '@bloomwalletio/ui'
    import { getBaseToken } from '@core/profile/actions'
    import { estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/actions'
    import { GAS_LIMIT_MULTIPLIER } from '@core/layer-2'

    let tokenAmountInput: TokenAmountInput
    let token: ITokenWithBalance
    let rawAmount: string
    let amount: string
    let unit: string
    let maxGasFee: number = 0

    const sendFlowType = $sendFlowParameters.type
    if (sendFlowType === SendFlowType.BaseCoinTransfer || sendFlowType === SendFlowType.TokenTransfer) {
        token = getTokenFromSelectedAccountTokens(
            $sendFlowParameters[sendFlowType].token?.id,
            $sendFlowParameters[sendFlowType].token?.networkId
        )
        rawAmount = $sendFlowParameters[sendFlowType].rawAmount
        unit = $sendFlowParameters[sendFlowType].unit || getUnitFromTokenMetadata(token?.metadata)
    }

    function setToMax(): void {
        if (token?.metadata?.decimals) {
            amount = formatTokenAmountDefault(token.balance.available - Number(maxGasFee), token?.metadata, unit, false)
        } else {
            amount = (token.balance.available - Number(maxGasFee))?.toString() ?? '0'
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
        })
        $sendFlowRouter.previous()
    }

    $: setMaxGasFee($sendFlowParameters)
    async function setMaxGasFee(sendFlowParams: SendFlowParameters): Promise<void> {
        if (token.id !== BASE_TOKEN_ID) {
            return
        }

        const networkId = getNetworkIdFromSendFlowParameters(sendFlowParams)
        const tempSendFlowParams = {
            ...sendFlowParams,
            [sendFlowType]: {
                token,
                rawAmount: token.balance.available,
                unit,
            },
        }

        if (isEvmChain(networkId)) {
            const chain = getNetwork()?.getChain(networkId)
            try {
                const txData = await createEvmTransactionFromSendFlowParameters(
                    tempSendFlowParams,
                    chain,
                    $selectedAccount
                )
                maxGasFee = txData ? Number(calculateMaxGasFeeFromTransactionData(txData)) : undefined
            } catch (error) {
                console.error(error)
            }
        } else if (isEvmChain(sendFlowParams.destinationNetworkId)) {
            const estimatedGas = await estimateGasForLayer1ToLayer2Transaction(tempSendFlowParams)
            maxGasFee = Math.floor(estimatedGas * GAS_LIMIT_MULTIPLIER)
        }
    }

    onMount(async () => {
        await setMaxGasFee($sendFlowParameters)
    })
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
        availableBalance={token?.balance?.available}
    />
    <TokenAvailableBalanceTile
        token={{ ...token, balance: { ...token.balance, available: token.balance.available - Number(maxGasFee) } }}
        onMaxClick={setToMax}
    />

    {#if token.id === BASE_TOKEN_ID && maxGasFee}
        <Table
            items={[
                {
                    key: localize('general.transactionFee'),
                    value: formatTokenAmountPrecise(maxGasFee, getBaseToken()),
                },
            ]}
        />
    {/if}
</SendFlowTemplate>
