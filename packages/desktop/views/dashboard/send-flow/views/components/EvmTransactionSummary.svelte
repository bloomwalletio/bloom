<script lang="ts">
    import {
        EvmTransactionData,
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
    } from '@core/layer-2'
    import { INft } from '@core/nfts'
    import { SendFlowParameters, TokenTransferData } from '@core/wallet'
    import { SendFlowType } from '@core/wallet/stores'
    import { TransactionAssetSection } from '@ui'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import { getActiveNetworkId, getNetwork } from '@core/network'

    export let transaction: EvmTransactionData
    export let sendFlowParameters: SendFlowParameters

    $: destinationNetwork =
        sendFlowParameters?.destinationNetworkId === getActiveNetworkId()
            ? getNetwork().getMetadata().name
            : getNetwork()?.getChain(sendFlowParameters?.destinationNetworkId)?.getConfiguration().name

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
