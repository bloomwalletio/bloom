<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IParsedSmartContractData } from '@core/layer-2'
    import { EvmNetworkId } from '@core/network'
    import { EvmTransactionAlert } from '.'

    export let parsedSmartContract: IParsedSmartContractData
    export let networkId: EvmNetworkId
</script>

<EvmTransactionAlert
    variant="warning"
    message={localize('popups.smartContractCall.unableToVerify')}
    {networkId}
    contractAddress={parsedSmartContract.recipientAddress}
>
    {#if parsedSmartContract.parsedMethod}
        <Table
            collapsible
            collapsibleTitle={parsedSmartContract.parsedMethod.name}
            items={parsedSmartContract?.parsedMethod.inputs.map((input) => ({
                key: input.name,
                value: String(input.value) ?? localize('general.unknown'),
            }))}
        />
    {:else}
        <Table
            items={[
                {
                    key: localize('general.data'),
                    value: parsedSmartContract.rawData,
                    copyable: true,
                },
            ]}
        />
    {/if}
</EvmTransactionAlert>
