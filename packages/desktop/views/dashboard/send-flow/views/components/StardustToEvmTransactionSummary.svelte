<script lang="ts">
    import { getActiveNetworkId } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    const { destinationNetworkId } = sendFlowParameters

    $: transactionFee = sendFlowParameters?.gasFee
    $: storageDeposit = getStorageDeposit(sendFlowParameters)

    function getTransactionAssets(sendFlowParameters: SendFlowParameters): {
        nft?: INft
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        const baseCoin = $selectedAccountTokens?.[getActiveNetworkId()].baseCoin
        const baseCoinTransfer = {
            token: baseCoin,
            rawAmount: sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0',
        }

        switch (sendFlowParameters.type) {
            case SendFlowType.BaseCoinTransfer:
                return { baseCoinTransfer }
            case SendFlowType.TokenTransfer:
                return {
                    tokenTransfer: sendFlowParameters.tokenTransfer,
                    baseCoinTransfer,
                }
            case SendFlowType.NftTransfer:
                return {
                    nft: sendFlowParameters.nft,
                    baseCoinTransfer,
                }
        }
    }

    function getStorageDeposit(sendFlowParameters: SendFlowParameters): number {
        const amountWithTransactionFee =
            sendFlowParameters.type === SendFlowType.BaseCoinTransfer
                ? Number(output.amount) - Number(sendFlowParameters.baseCoinTransfer.rawAmount)
                : Number(output.amount)
        return amountWithTransactionFee - sendFlowParameters.gasFee
    }
</script>

<div class="w-full space-y-5">
    <TransactionAssetSection {...getTransactionAssets(sendFlowParameters)} />

    <StardustTransactionDetails {transactionFee} {storageDeposit} {destinationNetworkId} disableAll />
</div>
