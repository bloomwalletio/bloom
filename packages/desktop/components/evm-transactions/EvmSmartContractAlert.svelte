<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IParsedMethod, IParsedSmartContractData } from '@core/layer-2'
    import { EvmNetworkId } from '@core/network'
    import { EvmTransactionAlert } from '.'

    export let parsedSmartContract: IParsedSmartContractData
    export let networkId: EvmNetworkId

    function getMethodSignature(parsedMethod: IParsedMethod): string {
        const parameterSignatures = parsedMethod.inputs.map((input) => `${input.name} ${input.type}`)
        return `${parsedMethod.name}(${parameterSignatures.join(', ')})`
    }
</script>

{#if parsedSmartContract.parsedMethod}
    <EvmTransactionAlert
        variant="warning"
        message={localize('popups.smartContractCall.partiallyVerified')}
        {networkId}
        contractAddress={parsedSmartContract.recipientAddress}
    >
        <Table
            collapsible
            collapsibleTitle={getMethodSignature(parsedSmartContract.parsedMethod)}
            items={parsedSmartContract?.parsedMethod.inputs.map((input) => ({
                key: input.name,
                value: String(input.value ?? localize('general.unknown')),
            }))}
        />
    </EvmTransactionAlert>
{:else}
    <EvmTransactionAlert
        variant="danger"
        message={localize('popups.smartContractCall.unableToVerify')}
        {networkId}
        contractAddress={parsedSmartContract.recipientAddress}
    >
        <Table
            items={[
                {
                    key: localize('general.data'),
                    value: parsedSmartContract.rawData,
                    copyable: true,
                },
            ]}
        />
    </EvmTransactionAlert>
{/if}
