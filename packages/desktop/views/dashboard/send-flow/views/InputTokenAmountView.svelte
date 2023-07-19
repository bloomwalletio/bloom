<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        IAsset,
        SendFlowType,
        formatTokenAmountDefault,
        getUnitFromTokenMetadata,
        sendFlowParameters,
        updateSendFlowParameters,
    } from '@core/wallet'
    import { TokenAmountInput, TokenAvailableBalanceTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let assetAmountInput: TokenAmountInput
    let asset: IAsset
    let rawAmount: string
    let amount: string
    let unit: string

    if ($sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
        asset = $sendFlowParameters.baseCoinTransfer.asset
        rawAmount = $sendFlowParameters.baseCoinTransfer.rawAmount
        unit = $sendFlowParameters.baseCoinTransfer.unit || getUnitFromTokenMetadata(asset?.metadata)
    } else if ($sendFlowParameters.type === SendFlowType.TokenTransfer) {
        asset = $sendFlowParameters.tokenTransfer.asset
        rawAmount = $sendFlowParameters.tokenTransfer.rawAmount
        unit = $sendFlowParameters.tokenTransfer.unit || getUnitFromTokenMetadata(asset?.metadata)
    }

    $: availableBalance = asset?.balance?.available

    function setToMax(): void {
        if (asset?.metadata?.decimals) {
            amount = formatTokenAmountDefault(availableBalance, asset?.metadata, unit, false)
        } else {
            amount = availableBalance.toString() ?? '0'
        }
    }

    async function onContinueClick(): Promise<void> {
        try {
            await assetAmountInput?.validate()
            if ($sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
                updateSendFlowParameters({
                    type: SendFlowType.BaseCoinTransfer,
                    baseCoinTransfer: {
                        asset,
                        rawAmount,
                        unit,
                    },
                })
            } else if ($sendFlowParameters.type === SendFlowType.TokenTransfer) {
                updateSendFlowParameters({
                    type: SendFlowType.TokenTransfer,
                    tokenTransfer: {
                        asset,
                        rawAmount,
                        unit,
                    },
                })
            }
            $sendFlowRouter.next()
        } catch (err) {
            console.error(err)
        }
    }

    function onBackClick(): void {
        if ($sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
            updateSendFlowParameters({
                type: SendFlowType.BaseCoinTransfer,
                baseCoinTransfer: {
                    asset,
                    rawAmount: undefined,
                    unit,
                },
            })
        } else if ($sendFlowParameters.type === SendFlowType.TokenTransfer) {
            updateSendFlowParameters({
                type: SendFlowType.TokenTransfer,
                tokenTransfer: {
                    asset,
                    rawAmount: undefined,
                    unit,
                },
            })
        }
        $sendFlowRouter.previous()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectAmount', {
        values: { tokenName: asset.metadata.name },
    })}
    leftButton={{ text: localize('actions.back'), onClick: onBackClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !amount }}
>
    <TokenAmountInput
        bind:this={assetAmountInput}
        bind:asset
        bind:rawAmount
        bind:inputtedAmount={amount}
        {unit}
        {availableBalance}
    />
    <TokenAvailableBalanceTile {asset} onMaxClick={setToMax} />
</SendFlowTemplate>
