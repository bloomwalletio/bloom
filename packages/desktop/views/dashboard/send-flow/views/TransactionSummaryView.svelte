<script lang="ts">
    import { closePopup } from '@desktop/auxiliary/popup'
    import { getSelectedAccount, selectedAccount, selectedAccountIndex } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { NewTransactionType, newTransactionData } from '@core/wallet/stores'
    import {
        createEvmTransaction,
        prepareOutputFromTransactionData,
        signAndSendEvmTransaction,
        validateSendConfirmation,
    } from '@core/wallet/utils'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { EvmTransactionSummary, StardustTransactionSummary } from './components'
    import { truncateString } from '@core/utils'
    import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
    import { LedgerAppName, ledgerPreparedOutput } from '@core/ledger'
    import { Output, TransactionData, sendOutput } from '@core/wallet'
    import { IChain, getNetwork } from '@core/network'
    import { EvmTransactionData } from '@core/layer-2'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: isTransferring = !!$selectedAccount.isTransferring
    $: void updateSendFlow($newTransactionData)

    let isAssetFromLayer2 = false
    let recipient: string
    let preparedOutput: Output | undefined
    let preparedTransaction: EvmTransactionData | undefined
    let chain: IChain | undefined

    async function updateSendFlow(transactionData: TransactionData): Promise<void> {
        recipient = transactionData.recipient.type === 'account'
            ? transactionData.recipient.account.name
            : truncateString(transactionData.recipient?.address, 6, 6)

        isAssetFromLayer2 = transactionData.type === NewTransactionType.TokenTransfer ? !!transactionData.asset.chainId : false
        if (isAssetFromLayer2) {
            const chainId = transactionData?.type === NewTransactionType.TokenTransfer ? transactionData.asset.chainId : undefined
            chain = getNetwork()?.getChain(chainId)
            const account = getSelectedAccount()

            preparedTransaction = await createEvmTransaction(chain, account)
        } else {
            preparedOutput = await prepareOutputFromTransactionData($selectedAccountIndex)
        }
    }

    async function sendFromStardust(output: Output): Promise<void> {
        validateSendConfirmation(output)

        if (getIsActiveLedgerProfile()) {
            ledgerPreparedOutput.set(output)
        }

        await checkActiveProfileAuth(
            async () => {
                await sendOutput(output)
                closePopup()
            },
            { stronghold: true, ledger: false }
        )
        return
    }

    async function sendTransactionFromEvm(transaction: EvmTransactionData, chain: IChain): Promise<void> {
        const account = getSelectedAccount()
        const provider = chain.getProvider()

        await checkActiveProfileAuth(
            async () => {
                await signAndSendEvmTransaction(transaction, provider, account.index)
                closePopup()
            },
            { stronghold: true, ledger: true },
            LedgerAppName.Ethereum
        )
    }

    async function onConfirmClick(): Promise<void> {
        try {
            if (isAssetFromLayer2) {
                await sendTransactionFromEvm(preparedTransaction, chain)
            } else {
                await sendFromStardust(preparedOutput)
            }
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        if (!$sendFlowRouter.hasHistory()) {
            closePopup()
        } else {
            $sendFlowRouter.previous()
        }
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient } })}
    leftButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
        disabled: isTransferring,
    }}
    rightButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
        isBusy: isTransferring,
    }}
>
    {#if isAssetFromLayer2}
        <EvmTransactionSummary {_onMount} />
    {:else}
        <StardustTransactionSummary {_onMount} />
    {/if}
</SendFlowTemplate>
