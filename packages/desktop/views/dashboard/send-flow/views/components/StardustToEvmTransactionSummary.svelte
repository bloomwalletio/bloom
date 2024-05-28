<script lang="ts">
    import { Nft } from '@core/nfts/interfaces'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { TransactionAssetSection } from '@ui'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'
    import { BASE_TOKEN_ID } from '@core/token'
    import { localize } from '@core/i18n'
    import { Alert } from '@bloomwalletio/ui'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    const { sourceNetworkId, destinationNetworkId } = sendFlowParameters

    $: transactionFee =
        sendFlowParameters.type === SendFlowType.BaseCoinTransfer
            ? BigInt(output.amount) - (sendFlowParameters.baseCoinTransfer?.rawAmount ?? BigInt(0))
            : BigInt(output.amount)

    let nft: Nft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined
    $: ({ nft, tokenTransfer, baseCoinTransfer } = getTransactionAssets(sendFlowParameters))

    function getTransactionAssets(sendFlowParameters: SendFlowParameters): {
        nft?: Nft
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        if (!sourceNetworkId) {
            return {}
        }

        const baseCoin = getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, sourceNetworkId)
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
    <TransactionAssetSection {baseCoinTransfer} {nft} {tokenTransfer} />
    {#if true}
        <Alert variant="warning" text={localize('popups.transaction.ircAssetsToL2Hint')} />
    {/if}

    <StardustTransactionDetails {transactionFee} {destinationNetworkId} disableAll />
</div>
