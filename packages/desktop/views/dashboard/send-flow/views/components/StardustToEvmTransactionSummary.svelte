<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { getStorageDepositFromOutput } from '@core/activity/utils/helper'
    import { getActiveNetworkId } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import { onMount } from 'svelte'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    const { destinationNetworkId } = sendFlowParameters

    let storageDeposit: number

    $: isTransferring = !!$selectedAccount.isTransferring
    $: storageDeposit = getStorageDepositFromOutput(output)

    $: transactionFee =
        sendFlowParameters.type === SendFlowType.BaseCoinTransfer
            ? String(Number(output.amount) - Number(sendFlowParameters.baseCoinTransfer.rawAmount))
            : output.amount

    function getTransactionAssets(sendFlowParameters: SendFlowParameters): {
        nft?: INft
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        const baseCoin = $selectedAccountTokens?.[getActiveNetworkId()].baseCoin

        if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
            return {
                baseCoinTransfer: {
                    token: baseCoin,
                    rawAmount: sendFlowParameters.baseCoinTransfer.rawAmount,
                },
            }
        } else {
            const baseCoinTransfer = {
                token: baseCoin,
                rawAmount: '0',
            }
            if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
                return {
                    tokenTransfer: sendFlowParameters.tokenTransfer,
                    baseCoinTransfer,
                }
            } else {
                return {
                    nft: sendFlowParameters.nft,
                    baseCoinTransfer,
                }
            }
        }
    }

    onMount(() => {
        storageDeposit = getStorageDepositFromOutput(output)
    })
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {...getTransactionAssets(sendFlowParameters)} />

    <StardustTransactionDetails
        storageDeposit={getStorageDepositFromOutput(output)}
        {transactionFee}
        {destinationNetworkId}
        disableAll={isTransferring}
    />
</div>
