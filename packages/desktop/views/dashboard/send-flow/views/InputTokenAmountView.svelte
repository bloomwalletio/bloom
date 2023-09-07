<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        ITokenWithBalance,
        formatTokenAmountDefault,
        formatTokenAmountPrecise,
        getUnitFromTokenMetadata,
    } from '@core/token'
    import { getTokenBalance } from '@core/token/actions'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import {
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
    import { BigIntLike } from '@ethereumjs/util'
    import { Table } from '@bloomwalletio/ui'
    import { getBaseToken } from '@core/profile/actions'

    let tokenAmountInput: TokenAmountInput
    let token: ITokenWithBalance
    let rawAmount: string
    let amount: string
    let unit: string
    let maxGasFee: BigIntLike = 0
    const tokenKey = $sendFlowParameters.type === SendFlowType.TokenTransfer ? 'tokenTransfer' : 'baseCoinTransfer'

    if (
        $sendFlowParameters.type === SendFlowType.BaseCoinTransfer ||
        $sendFlowParameters.type === SendFlowType.TokenTransfer
    ) {
        token = getTokenFromSelectedAccountTokens(
            $sendFlowParameters[tokenKey].token?.id,
            $sendFlowParameters[tokenKey].token?.networkId
        )
        rawAmount = $sendFlowParameters[tokenKey].rawAmount
        unit = $sendFlowParameters[tokenKey].unit || getUnitFromTokenMetadata(token?.metadata)
    }

    $: tokenBalance = getTokenBalance(token?.id, token?.networkId)

    function setToMax(): void {
        if (token?.metadata?.decimals) {
            amount = formatTokenAmountDefault(tokenBalance?.available, token?.metadata, unit, false)
        } else {
            amount = tokenBalance?.available?.toString() ?? '0'
        }
    }

    async function onContinueClick(): Promise<void> {
        try {
            await tokenAmountInput?.validate()

            updateSendFlowParameters({
                type: $sendFlowParameters.type,
                [tokenKey]: {
                    token: $sendFlowParameters[tokenKey].token,
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
                token: $sendFlowParameters[tokenKey].token,
                rawAmount: undefined,
                unit,
            },
        })
        $sendFlowRouter.previous()
    }

    onMount(async () => {
        const networkId = getNetworkIdFromSendFlowParameters($sendFlowParameters)
        if (isEvmChain(networkId)) {
            const chain = getNetwork()?.getChain(networkId)
            const txData = await createEvmTransactionFromSendFlowParameters(
                $sendFlowParameters,
                chain,
                $selectedAccount
            )

            maxGasFee = formatTokenAmountPrecise(Number(calculateMaxGasFeeFromTransactionData(txData)), getBaseToken())
        }
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
        availableBalance={tokenBalance?.available}
    />
    <TokenAvailableBalanceTile
        token={getTokenFromSelectedAccountTokens(token.id, token.networkId)}
        onMaxClick={setToMax}
    />

    {#if maxGasFee}
        <Table
            items={[
                {
                    key: localize('general.transactionFee'),
                    value: String(maxGasFee),
                },
            ]}
        />
    {/if}
</SendFlowTemplate>
