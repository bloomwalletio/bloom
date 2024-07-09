<script lang="ts">
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { localize } from '@core/i18n'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { TransactionAssetSection } from '@ui'
    import { IEvmNetwork } from '@core/network'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import { TokenTransferData } from '@core/wallet/types'

    export let baseCoinTransfer: TokenTransferData
    export let tokenId: string
    export let rawAmount: bigint
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let evmNetwork: IEvmNetwork
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let busy = false

    $: tokenTransfer = {
        token: getTokenFromSelectedAccountTokens(tokenId, evmNetwork.id),
        rawAmount: rawAmount,
    }

    $: localeKey = method === RpcMethod.EthSignTransaction ? 'signTransaction' : 'sendTransaction'
</script>

<PopupTemplate
    title={localize(`popups.${localeKey}.title`)}
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
        <TransactionAssetSection {baseCoinTransfer} {tokenTransfer} />
        {#if $$slots.transactionDetails}
            <slot name="transactionDetails" />
        {/if}
    </div>
</PopupTemplate>
