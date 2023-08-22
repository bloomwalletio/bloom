<script lang="ts">
    import {
        EvmTransactionData,
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
    } from '@core/layer-2'
    import { getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { INft } from '@core/nfts'
    import { SendFlowParameters, TokenTransferData } from '@core/wallet'
    import { SendFlowType } from '@core/wallet/stores'
    import { TransactionAssetSection } from '@ui'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'

    export let transaction: EvmTransactionData
    export let sendFlowParameters: SendFlowParameters

    $: destinationNetwork = getDestinationNetworkFromAddress(sendFlowParameters?.layer2Parameters?.networkAddress)

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
        {destinationNetwork}
        estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction)}
        maxGasFee={calculateMaxGasFeeFromTransactionData(transaction)}
    />
</div>
