<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { getActiveNetworkId } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    const { destinationNetworkId } = sendFlowParameters

    $: isTransferring = !!$selectedAccount.isTransferring

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
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {...getTransactionAssets(sendFlowParameters)} />

    <StardustTransactionDetails {transactionFee} {destinationNetworkId} disableAll={isTransferring} />
</div>
