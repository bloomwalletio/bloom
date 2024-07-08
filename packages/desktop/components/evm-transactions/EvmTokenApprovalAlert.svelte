<script lang="ts">
    import { NumberInput, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ERC20_ABI, IParsedTokenApproval } from '@core/layer-2'
    import { ExplorerEndpoint, getExplorerUrl, IEvmNetwork } from '@core/network'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { truncateString } from '@core/utils'
    import { TransactionAssetSection } from '@ui'
    import { EvmTransactionAlert } from '.'
    import { IToken } from '@core/token'
    import { openUrlInBrowser } from '@core/app/utils'
    import { Alert } from '@bloomwalletio/ui'

    export let parsedTokenApproval: IParsedTokenApproval
    export let rawTransactionData: string
    export let network: IEvmNetwork

    let { tokenId, spender, rawAmount } = parsedTokenApproval
    let tokenTransfer = {
        token: getTokenFromSelectedAccountTokens(tokenId, network.id) as IToken,
        rawAmount: rawAmount,
    }
    const contract = network.getContract(ERC20_ABI, '')

    $: rawAmount, updateEvmTransactionData()
    function updateEvmTransactionData(): void {
        tokenTransfer = { ...tokenTransfer, rawAmount }
        const updatedData = contract.methods.approve(spender, rawAmount).encodeABI()

        rawTransactionData = updatedData
    }

    function onExplorerClick(address: string): void {
        const url = getExplorerUrl(network.id, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }
</script>

<EvmTransactionAlert
    variant="info"
    message={localize('popups.tokenApproval.hint', {
        address: truncateString(spender, 6, 6),
        assetName: tokenTransfer.token?.metadata?.name ?? truncateString(tokenId, 6, 6),
    })}
    networkId={network.id}
    contractAddress={tokenId}
>
    <NumberInput label={localize('general.amount')} bind:value={rawAmount} on:change={updateEvmTransactionData} />
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
