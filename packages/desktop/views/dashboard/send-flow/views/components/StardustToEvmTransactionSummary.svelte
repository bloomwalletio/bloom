<script lang="ts">
    import { getActiveNetworkId } from '@core/network'
    import { Nft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    const { destinationNetworkId } = sendFlowParameters

    $: transactionFee =
        sendFlowParameters.type === SendFlowType.BaseCoinTransfer
            ? BigInt(output.amount) - sendFlowParameters.baseCoinTransfer.rawAmount
            : BigInt(output.amount)

    function getTransactionAssets(sendFlowParameters: SendFlowParameters): {
        nft?: Nft
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        const baseCoin = $selectedAccountTokens?.[getActiveNetworkId()].baseCoin
        const baseCoinTransfer = {
            token: baseCoin,
            rawAmount: sendFlowParameters.baseCoinTransfer?.rawAmount ?? BigInt(0),
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
</script>

<div class="w-full space-y-5">
    <TransactionAssetSection {...getTransactionAssets(sendFlowParameters)} />

    <StardustTransactionDetails {transactionFee} {destinationNetworkId} disableAll />
</div>
