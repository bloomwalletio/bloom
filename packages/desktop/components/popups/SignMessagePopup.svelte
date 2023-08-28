<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'
    import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
    import { sleep } from '@core/utils'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let requestId: number
    export let message: string
    export let dapp: IConnectedDapp | undefined
    export let callback: (response: JsonRpcResponse) => void

    let isBusy = false

    async function onConfirmClick(): Promise<void> {
        isBusy = true
        try {
            const signedMessage = await sign()
            const response = { id: requestId, result: signedMessage, jsonrpc: '2.0' }

            callback(response)
            closePopup()
        } finally {
            isBusy = false
        }
    }

    async function sign(): Promise<string> {
        await sleep(500)
        return 'hoilahoil'
    }

    function onCancelClick(): void {
        callback({ id: requestId, error: { code: 5000, message: 'User rejected' }, jsonrpc: '2.0' })
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.signMessage.title')}
    </Text>
    <div class="space-y-4">
        <section class="flex flex-col border-1 border-gray-200 rounded-4 p-6">
            <Text>{localize('popups.signMessage.message')}</Text>
            <Text>{message}</Text>
        </section>
        {#if dapp}
            <TextHint info text={localize('popups.signMessage.hint', { dappName: dapp.metadata?.name ?? 'Unkown' })} />
        {:else}
            <TextHint warning text={localize('popups.signMessage.warning')} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            disabled={$selectedAccount.isTransferring || isBusy}
            isBusy={$selectedAccount.isTransferring || isBusy}
            onClick={onConfirmClick}
        >
            {localize('popups.signMessage.action')}
        </Button>
    </popup-buttons>
</div>
