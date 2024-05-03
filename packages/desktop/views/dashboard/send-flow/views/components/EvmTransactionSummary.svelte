<script lang="ts">
    import {
        EvmTransactionData,
        L2_TO_L1_STORAGE_DEPOSIT_BUFFER,
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
    } from '@core/layer-2'
    import { Nft, isIrc27Nft } from '@core/nfts'
    import { SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import { IEvmNetwork } from '@core/network'

    export let transaction: EvmTransactionData
    export let sendFlowParameters: SendFlowParameters
    export let network: IEvmNetwork

    $: transactionAsset = getTransactionAsset(sendFlowParameters)
    function getTransactionAsset(_sendFlowParameters: SendFlowParameters): {
        tokenTransfer?: TokenTransferData
        nft?: Nft
    } {
        return {
            ...(_sendFlowParameters.type === SendFlowType.TokenTransfer && {
                tokenTransfer: _sendFlowParameters.tokenTransfer,
            }),
            ...(_sendFlowParameters.type === SendFlowType.NftTransfer && { nft: _sendFlowParameters.nft }),
        }
    }

    $: storageDeposit = getTransactionStorageDeposit(sendFlowParameters) ?? BigInt(0)
    function getTransactionStorageDeposit(_sendFlowParameters: SendFlowParameters): bigint | undefined {
        if (_sendFlowParameters.type === SendFlowType.TokenTransfer) {
            if (_sendFlowParameters.destinationNetworkId !== _sendFlowParameters.tokenTransfer?.token.networkId) {
                return BigInt(L2_TO_L1_STORAGE_DEPOSIT_BUFFER[SendFlowType.TokenUnwrap] ?? 0)
            }
        } else if (_sendFlowParameters.type === SendFlowType.NftTransfer) {
            if (
                _sendFlowParameters.destinationNetworkId !== _sendFlowParameters.nft?.networkId &&
                _sendFlowParameters.nft &&
                isIrc27Nft(_sendFlowParameters.nft)
            ) {
                return (
                    (_sendFlowParameters.nft?.storageDeposit ?? BigInt(0)) +
                    (L2_TO_L1_STORAGE_DEPOSIT_BUFFER[SendFlowType.NftUnwrap] ?? BigInt(0))
                )
            }
        }
    }
</script>

<div class="w-full space-y-5">
    <TransactionAssetSection baseCoinTransfer={sendFlowParameters.baseCoinTransfer} {...transactionAsset} />

    <EvmTransactionDetails
        destinationNetworkId={sendFlowParameters?.destinationNetworkId}
        estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction, network.type) + storageDeposit}
        maxGasFee={calculateMaxGasFeeFromTransactionData(transaction, network.type) + storageDeposit}
    />
</div>
