<script lang="ts">
    import { getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { SendFlowType } from '@core/wallet/stores'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import { EvmTransactionData } from '@core/layer-2'
    import { SendFlowParameters, TokenTransferData } from '@core/wallet'
    import { INft } from '@core/nfts'
    import { TransactionAssetSection } from '@ui'

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

    <EvmTransactionDetails gasBudget={Number(transaction.gasLimit)} {destinationNetwork} />
</div>
