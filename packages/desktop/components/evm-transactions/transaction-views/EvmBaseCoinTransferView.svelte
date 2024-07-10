<script lang="ts">
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { localize } from '@core/i18n'
    import { TransactionAssetSection } from '@ui'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import { Subject, TokenTransferData } from '@core/wallet'
    import { getNameFromSubject } from '@core/activity/utils'

    export let baseCoinTransfer: TokenTransferData
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let recipient: Subject
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let busy = false

    $: localeKey = method === RpcMethod.EthSignTransaction ? 'signTransaction' : 'sendTransaction'
</script>

<PopupTemplate
    title={localize(`popups.${localeKey}.title`, {
        asset: baseCoinTransfer.token?.metadata?.name,
        recipient: getNameFromSubject(recipient),
    })}
    {backButton}
    continueButton={{
        ...continueButton,
        text: localize(`popups.${localeKey}.action`),
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
        {#if $$slots.transactionDetails}
            <slot name="transactionDetails" />
        {/if}
    </div>
</PopupTemplate>
