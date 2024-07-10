<script lang="ts">
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import { selectedAccount } from '@core/account/stores'
    import { getNameFromSubject } from '@core/activity'
    import { localize } from '@core/i18n'
    import { getNftByIdForAccount } from '@core/nfts/stores'
    import { Subject, TokenTransferData } from '@core/wallet/types'
    import { TransactionAssetSection } from '@ui'

    export let baseCoinTransfer: TokenTransferData
    export let nftId: string
    export let recipient: Subject
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let busy = false

    $: nft = getNftByIdForAccount($selectedAccount?.index, nftId)

    $: localeKey = method === RpcMethod.EthSignTransaction ? 'signTransaction' : 'sendTransaction'
</script>

<PopupTemplate
    title={localize(`popups.${localeKey}.title`, {
        asset: nft?.metadata?.name,
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
        <TransactionAssetSection {baseCoinTransfer} {nft} />
        <slot name="transactionDetails" />
    </div>
</PopupTemplate>
