<script lang="ts">
    import { handleError } from '@core/error/handlers'
    import { EvmTransactionData, GasSpeed, IGasPricesBySpeed, getL2ToL1StorageDepositBuffer } from '@core/layer-2'
    import { IEvmNetwork, StardustNetworkId } from '@core/network'
    import { Nft, isIrc27Nft } from '@core/nfts'
    import { SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'

    export let transaction: EvmTransactionData
    export let sendFlowParameters: SendFlowParameters
    export let network: IEvmNetwork
    export let selectedGasSpeed: GasSpeed
    export let gasPrices: IGasPricesBySpeed

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
        try {
            const { type, destinationNetworkId } = _sendFlowParameters
            if (type === SendFlowType.TokenTransfer) {
                if (
                    destinationNetworkId &&
                    destinationNetworkId !== _sendFlowParameters?.tokenTransfer?.token.networkId
                ) {
                    return getL2ToL1StorageDepositBuffer(
                        SendFlowType.TokenUnwrap,
                        destinationNetworkId as StardustNetworkId
                    )
                }
            } else if (type === SendFlowType.NftTransfer) {
                if (
                    destinationNetworkId &&
                    destinationNetworkId !== _sendFlowParameters.nft?.networkId &&
                    isIrc27Nft(_sendFlowParameters.nft)
                ) {
                    const buffer = getL2ToL1StorageDepositBuffer(
                        SendFlowType.NftUnwrap,
                        destinationNetworkId as StardustNetworkId
                    )
                    return (_sendFlowParameters.nft?.storageDeposit ?? BigInt(0)) + buffer
                }
            }
        } catch (err) {
            handleError(err)
        }
    }
</script>

<div class="w-full space-y-5">
    <TransactionAssetSection baseCoinTransfer={sendFlowParameters.baseCoinTransfer} {...transactionAsset} />

    <EvmTransactionDetails
        bind:selectedGasSpeed
        sourceNetwork={network}
        destinationNetworkId={sendFlowParameters?.destinationNetworkId}
        {transaction}
        {storageDeposit}
        {gasPrices}
    />
</div>
