<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { truncateString } from '@core/utils'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signMessage } from '@core/wallet/actions'
    import { Alert, Button, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { IChain } from '@core/network'
    import { AccountLabel } from '@ui'
    import { onMount } from 'svelte'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let message: string
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let method: 'eth_sign' | 'personal_sign' = 'personal_sign'
    export let callback: (params: CallbackParameters) => void

    $: address = truncateString(account.evmAddresses[chain.getConfiguration().coinType] ?? '', 8, 8)

    let isBusy = false

    async function onConfirmClick(): Promise<void> {
        await checkActiveProfileAuth(sign, { stronghold: false, ledger: false }, LedgerAppName.Ethereum)
    }

    async function sign(): Promise<void> {
        isBusy = true
        try {
            const { coinType } = chain.getConfiguration()
            const result = await signMessage(message, coinType, method, account)
            callback({ result })
        } catch (err) {
            callback({ error: err })
            handleError(err)
        } finally {
            isBusy = false
            closePopup()
        }
    }

    function onCancelClick(): void {
        callback({ error: 'User rejected' })
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
    <Text type="h5" textColor="primary">
        {localize('popups.signMessage.title')}
    </Text>
    <div class="space-y-5">
        <section class="relative flex flex-col border border-solid border-gray-200 rounded-xl p-6">
            <Text color="gray-600">{localize('general.message')}</Text>
            <Text>{message}</Text>
            {#if dapp}
                <div class="absolute flex flex-row justify-between" style="top: -12px; left: 18px;">
                    <div class="flex flex-row gap-1 bg-white dark:bg-gray-800 items-center px-2">
                        <img
                            style="width: 24px; height: 24px; border-radius: 24px;"
                            src={dapp.metadata?.icons?.[0]}
                            alt={dapp.metadata?.name}
                        />
                        <Text type="xs">
                            {dapp.metadata?.name}
                        </Text>
                    </div>
                </div>
            {/if}
        </section>
        <section class="flex flex-row justify-between items-center border border-solid border-gray-200 rounded-xl p-4">
            <AccountLabel {account} />
            <Text color="gray-600">
                {address}
            </Text>
        </section>
        {#if dapp}
            <Alert
                variant="info"
                text={localize('popups.signMessage.hint', { dappName: dapp.metadata?.name ?? 'Unkown' })}
            />
        {:else}
            <Alert variant="warning" text={localize('popups.signMessage.warning')} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button variant="outlined" width="full" on:click={onCancelClick} text={localize('actions.cancel')} />
        <Button
            disabled={$selectedAccount.isTransferring || isBusy}
            busy={$selectedAccount.isTransferring || isBusy}
            on:click={onConfirmClick}
            width="full"
            text={localize('popups.signMessage.action')}
        />
    </popup-buttons>
</div>
