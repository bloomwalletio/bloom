<script lang="ts">
    import { localize } from '@core/i18n'
    import { TransactionAssetSection } from '@ui'
    import { EvmNetworkId } from '@core/network'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import { TokenTransferData } from '@core/wallet/types'
    import EvmSmartContractAlert from '../EvmSmartContractAlert.svelte'
    import { IParsedSmartContractData } from '@core/layer-2/interfaces'
    import { truncateString } from '@core/utils/string'

    export let baseCoinTransfer: TokenTransferData

    export let parsedData: IParsedSmartContractData
    export let contractAddress: string
    export let networkId: EvmNetworkId
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let busy = false

    const localeKey = 'popups.smartContractCall'
</script>

<PopupTemplate
    title={localize(`${localeKey}.title`, { contractAddress: truncateString(contractAddress, 6, 6) })}
    {backButton}
    continueButton={{
        ...continueButton,
        text: localize(`${localeKey}.action`),
    }}
    {busy}
>
    <svelte:fragment slot="banner">
        {#if $$slots.dappHeader}
            <slot name="dappHeader" />
        {/if}
    </svelte:fragment>
    <div class="flex flex-col space-y-5">
        <TransactionAssetSection {baseCoinTransfer} />
        <EvmSmartContractAlert parsedSmartContract={parsedData} {networkId} />
        {#if $$slots.transactionDetails}
            <slot name="transactionDetails" />
        {/if}
    </div>
</PopupTemplate>
