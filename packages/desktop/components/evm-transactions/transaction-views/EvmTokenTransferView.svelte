<script lang="ts">
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import { getNameFromSubject } from '@core/activity/utils'
    import { localize } from '@core/i18n'
    import { IEvmNetwork } from '@core/network'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { Subject, TokenTransferData } from '@core/wallet/types'
    import { TransactionAssetSection } from '@ui'

    export let baseCoinTransfer: TokenTransferData
    export let tokenId: string
    export let rawAmount: bigint
    export let recipient: Subject
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let evmNetwork: IEvmNetwork
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let busy = false

    $: token = getTokenFromSelectedAccountTokens(tokenId, evmNetwork.id)

    $: localeKey = method === RpcMethod.EthSignTransaction ? 'signTransaction' : 'sendTransaction'
</script>

<PopupTemplate
    title={localize(`popups.${localeKey}.title`, {
        asset: token?.metadata?.name,
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
        <TransactionAssetSection {baseCoinTransfer} tokenTransfer={{ token, rawAmount }} />
        <slot name="transactionDetails" />
    </div>
</PopupTemplate>
