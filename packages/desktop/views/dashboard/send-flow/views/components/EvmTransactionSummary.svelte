<script lang="ts">
    import { TransactionAssetSection } from '@ui'
    import {
        EvmTransactionData,
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
    } from '@core/layer-2'
    import { INft } from '@core/nfts'
    import { SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'

    export let transaction: EvmTransactionData
    export let sendFlowParameters: SendFlowParameters

    function getTransactionAsset(sendFlowParameters: SendFlowParameters): {
        tokenTransfer?: TokenTransferData
        nft?: INft
    } {
        return {
            ...(sendFlowParameters.type === SendFlowType.TokenTransfer && {
                tokenTransfer: sendFlowParameters.tokenTransfer,
            }),
            ...(sendFlowParameters.type === SendFlowType.NftTransfer && { nft: sendFlowParameters.nft }),
        }
    }
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection
        baseCoinTransfer={sendFlowParameters.baseCoinTransfer}
        {...getTransactionAsset(sendFlowParameters)}
    />

    <EvmTransactionDetails
        destinationNetworkId={sendFlowParameters?.destinationNetworkId}
        estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction)}
        maxGasFee={calculateMaxGasFeeFromTransactionData(transaction)}
    />
</div>
