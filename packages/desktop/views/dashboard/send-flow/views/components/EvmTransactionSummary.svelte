<script lang="ts">
    import {
        EvmTransactionData,
        IGasPrices,
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
        getL2ToL1StorageDepositBuffer,
    } from '@core/layer-2'
    import { Nft, isIrc27Nft } from '@core/nfts'
    import { SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import EvmTransactionDetails from './EvmTransactionDetails.svelte'
    import { IEvmNetwork } from '@core/network'
    import { handleError } from '@core/error/handlers'
    import { StardustNetworkId } from '@core/network'
    import { onDestroy, onMount } from 'svelte'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'

    export let transaction: EvmTransactionData
    export let sendFlowParameters: SendFlowParameters
    export let network: IEvmNetwork
    let selectedGasSpeed: 'required' | 'slow' | 'average' | 'fast' = 'required'

    let gasPrices: IGasPrices | undefined = undefined
    async function setGasPrices(): Promise<void> {
        const _gasPrices = await network.getGasPrices()
        if (_gasPrices) {
            gasPrices = _gasPrices
        }
    }

    $: console.log('gasPrices', gasPrices)

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

    let intervalId
    onMount(async () => {
        await setGasPrices()
        intervalId = setInterval(setGasPrices, MILLISECONDS_PER_SECOND * 10)
    })

    onDestroy(() => {
        clearInterval(intervalId)
    })

</script>

<div class="w-full space-y-5">
    <TransactionAssetSection baseCoinTransfer={sendFlowParameters.baseCoinTransfer} {...transactionAsset} />

    <EvmTransactionDetails
        bind:selectedGasSpeed
        sourceNetwork={network}
        destinationNetworkId={sendFlowParameters?.destinationNetworkId}
        estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction) + storageDeposit}
        maxGasFee={calculateMaxGasFeeFromTransactionData(transaction) + storageDeposit}
        {transaction}
        {storageDeposit}
        {gasPrices}
    />
</div>
