<script lang="ts">
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { localize } from '@core/i18n'
    import { TransactionAssetSection } from '@ui'
    import PopupTemplate, { ButtonProps } from '@components/popup/PopupTemplate.svelte'
    import { TokenTransferData } from '@core/wallet/types'
    import { selectedAccount } from '@core/account/stores'
    import { getNftByIdForAccount } from '@core/nfts/stores'

    export let baseCoinTransfer: TokenTransferData
    export let nftId: string
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let continueButton: ButtonProps
    export let backButton: ButtonProps
    export let busy = false

    $: nft = getNftByIdForAccount($selectedAccount?.index, nftId)

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
        <TransactionAssetSection {baseCoinTransfer} {nft} />
        {#if $$slots.transactionDetails}
            <slot name="transactionDetails" />
        {/if}
    </div>
</PopupTemplate>
