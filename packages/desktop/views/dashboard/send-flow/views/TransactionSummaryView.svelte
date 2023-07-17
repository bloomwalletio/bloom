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
    import { ledgerPreparedOutput } from '@core/ledger'
    import { sendOutput } from '@core/wallet'
    import { getNetwork } from '@core/network'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: transactionData = get(newTransactionData)
    $: recipient =
        transactionData.recipient.type === 'account'
            ? transactionData.recipient.account.name
            : truncateString(transactionData.recipient?.address, 6, 6)
    $: isTransferring = !!$selectedAccount.isTransferring
    $: isAssetFromLayer2 =
        transactionData.type === NewTransactionType.TokenTransfer ? !!transactionData.asset.chainId : false

    async function sendL1(): Promise<void> {
        const preparedOutput = await prepareOutputFromTransactionData($selectedAccountIndex)
        validateSendConfirmation(preparedOutput)

        if (getIsActiveLedgerProfile()) {
            ledgerPreparedOutput.set(preparedOutput)
        }

        await checkActiveProfileAuth(
            async () => {
                await sendOutput(preparedOutput)
                closePopup()
            },
            { stronghold: true, ledger: false }
        )
        return
    }

    async function sendL2(): Promise<void> {
        const chainId =
            transactionData?.type === NewTransactionType.TokenTransfer ? transactionData.asset.chainId : undefined
        if (!chainId) {
            return
        }

        const chain = getNetwork()?.getChain(chainId)
        const provider = chain?.getProvider()
        const account = getSelectedAccount()
        if (!chain || !provider || !account) {
            return Promise.resolve(undefined)
        }

        const transation = await createEvmTransaction(chain, account)
        await signAndSendEvmTransaction(transation, provider, account.index, closePopup)
    }

    async function onConfirmClick(): Promise<void> {
        try {
            if (isAssetFromLayer2) {
                await sendL2()
            } else {
                await sendL1()
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
