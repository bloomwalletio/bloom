<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { truncateString } from '@core/utils'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signEvmTransaction } from '@core/wallet/actions'
    import { Alert, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { IChain } from '@core/network'
    import { AccountLabel, TransactionAssetSection } from '@ui'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { showNotification } from '@auxiliary/notification/actions'
    import { EvmTransactionData } from '@core/layer-2/types'
    import { EvmTransactionDetails } from '@views/dashboard/send-flow/views/components'
    import { calculateEstimatedGasFeeFromTransactionData, calculateMaxGasFeeFromTransactionData } from '@core/layer-2'
    import { selectedAccountTokens } from '@core/token/stores'

    export let transaction: EvmTransactionData
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let callback: (params: CallbackParameters) => void

    // console.log(1)
    const { chainId, id, coinType } = chain.getConfiguration()
    const baseCoin = $selectedAccountTokens?.[id].baseCoin
    const baseCoinTransfer = {
        rawAmount: transaction.value.toString(),
        token: baseCoin,
    }

    $: address = truncateString(account.evmAddresses[coinType] ?? '', 8, 8)

    let isBusy = false

    async function onConfirmClick(): Promise<void> {
        await checkActiveProfileAuth(sign, { stronghold: false, ledger: false }, LedgerAppName.Ethereum)
    }

    async function sign(): Promise<void> {
        isBusy = true
        try {
            const result = await signEvmTransaction(transaction, chainId, account)

            showNotification({
                variant: 'success',
                text: localize('notifications.signMessage.success'),
            })
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
</script>

<PopupTemplate
    title={localize('popups.signMessage.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('popups.signMessage.action'),
        onClick: onConfirmClick,
    }}
    busy={$selectedAccount?.isTransferring || isBusy}
>
    <div class="space-y-5">
        <section class="relative flex flex-col border border-solid border-gray-200 rounded-xl p-6">
            <Text textColor="secondary">{localize('general.message')}</Text>

            <!-- <TransactionAssetSection {baseCoinTransfer} {...transactionAsset} /> -->
            <TransactionAssetSection {baseCoinTransfer} />

            <EvmTransactionDetails
                destinationNetworkId={id}
                estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction)}
                maxGasFee={calculateMaxGasFeeFromTransactionData(transaction)}
            />
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
            <Text textColor="secondary">
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
</PopupTemplate>
