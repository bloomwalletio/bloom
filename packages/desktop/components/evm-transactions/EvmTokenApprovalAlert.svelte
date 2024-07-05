<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IParsedTokenApproval } from '@core/layer-2'
    import { EvmNetworkId, ExplorerEndpoint, getExplorerUrl } from '@core/network'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { truncateString } from '@core/utils'
    import { TransactionAssetSection } from '@ui'
    import { EvmTransactionAlert } from '.'
    import { IToken } from '@core/token'
    import { openUrlInBrowser } from '@core/app/utils'
    import { Alert } from '@bloomwalletio/ui'

    export let parsedTokenApproval: IParsedTokenApproval
    export let networkId: EvmNetworkId

    const { tokenId, spender, rawAmount } = parsedTokenApproval
    const tokenTransfer = {
        token: getTokenFromSelectedAccountTokens(tokenId, networkId) as IToken,
        rawAmount: rawAmount,
    }

    function onExplorerClick(address: string): void {
        const url = getExplorerUrl(networkId, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }
</script>

<EvmTransactionAlert
    variant="info"
    message={localize('popups.tokenApproval.hint', {
        address: truncateString(spender, 6, 6),
        assetName: tokenTransfer.token?.metadata?.name ?? truncateString(tokenId, 6, 6),
    })}
    {networkId}
    contractAddress={tokenId}
>
    {#if tokenTransfer.token}
        <TransactionAssetSection {tokenTransfer} />
    {:else}
        <Alert variant="warning" text={localize('popups.tokenApproval.warning')} />
        <Table
            collapsible
            collapsibleTitle={localize('general.details')}
            items={[
                {
                    key: localize('general.tokenId'),
                    value: truncateString(tokenId, 16, 16),
                    onClick: () => onExplorerClick(tokenId),
                },
                { key: localize('general.spender'), value: spender, onClick: () => onExplorerClick(spender) },
                { key: localize('general.amount'), value: String(rawAmount) },
            ]}
        />
    {/if}
</EvmTransactionAlert>
