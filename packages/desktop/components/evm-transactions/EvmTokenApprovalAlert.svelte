<script lang="ts">
    import { EvmNetworkId } from '@core/network'
    import { localize } from '@core/i18n'
    import { EvmTransactionAlert } from '.'
    import { IParsedTokenApproval } from '@core/layer-2'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { TransactionAssetSection } from '@ui'
    import { truncateString } from '@core/utils'

    export let parsedTokenApproval: IParsedTokenApproval
    export let networkId: EvmNetworkId

    const { spender, rawAmount, tokenId } = parsedTokenApproval
    const tokenTransfer = {
        token: getTokenFromSelectedAccountTokens(tokenId, networkId),
        rawAmount: rawAmount,
    }
</script>

<EvmTransactionAlert
    variant="info"
    message={localize('popups.tokenApproval.hint', {
        address: truncateString(spender, 6, 6),
        assetName: tokenTransfer.token?.metadata?.name,
    })}
    {networkId}
    contractAddress={tokenId}
>
    <TransactionAssetSection {tokenTransfer} />
</EvmTransactionAlert>
