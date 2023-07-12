<script lang="ts">
    import { closePopup } from '@desktop/auxiliary/popup'
    import { prepareOutput, selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { activeProfile } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import { TimePeriod } from '@core/utils/enums'
    import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
    import {
        NewTransactionType,
        newTransactionData,
        selectedAccountAssets,
        updateNewTransactionData,
    } from '@core/wallet/stores'
    import { Output } from '@core/wallet/types'
    import { AddInputButton, ExpirationTimePicker, NftTile, OptionalInput, TokenAmountTile } from '@ui'
    import { createTransaction, getOutputParameters, getStorageDepositFromOutput } from '@core/wallet/utils'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import TransactionDetails from './components/TransactionDetails.svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let {
        expirationDate,
        timelockDate,
        disableChangeExpiration,
        giftStorageDeposit,
        surplus,
        layer2Parameters,
        tag,
        metadata,
        disableToggleGift,
    } = get(newTransactionData)

    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    let storageDeposit = 0
    let visibleSurplus = 0
    let preparedOutput: Output
    let expirationTimePicker: ExpirationTimePicker
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: transactionData = get(newTransactionData)
    $: recipient =
        transactionData.recipient.type === 'account'
            ? transactionData.recipient.account.name
            : truncateString(transactionData.recipient?.address, 6, 6)
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: isTransferring = !!$selectedAccount.isTransferring
    $: isLayer2 = !!layer2Parameters?.networkAddress
    $: isFromLayer2 =
        transactionData.type === NewTransactionType.TokenTransfer ? !!transactionData.asset.chainId : false
    $: expirationDate, timelockDate, giftStorageDeposit, refreshSendConfirmationState()

    function refreshSendConfirmationState(): void {
        if (!isFromLayer2) {
            updateNewTransactionData({
                type: transactionData.type,
                expirationDate,
                timelockDate,
                giftStorageDeposit,
                surplus,
            })
            void prepareTransactionOutput()
        }
    }

    function getInitialExpirationDate(): TimePeriod {
        if (expirationDate) {
            return TimePeriod.Custom
        } else if (storageDeposit && !giftStorageDeposit) {
            return TimePeriod.OneDay
        } else {
            return TimePeriod.None
        }
    }

    async function calculateInitialOutput() {
        await prepareTransactionOutput()
        selectedExpirationPeriod = getInitialExpirationDate()
    }

    async function prepareTransactionOutput(): Promise<void> {
        const transactionData = get(newTransactionData)

        const outputParams = await getOutputParameters(transactionData)
        preparedOutput = await prepareOutput($selectedAccount.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)

        setStorageDeposit(preparedOutput, Number(surplus))
    }

    function setStorageDeposit(preparedOutput: Output, surplus?: number): void {
        const rawAmount = transactionData.type === NewTransactionType.TokenTransfer ? transactionData.rawAmount : '0'

        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            getStorageDepositFromOutput(preparedOutput, rawAmount)

        if (surplus > _storageDeposit) {
            visibleSurplus = Number(surplus)
        }

        if (giftStorageDeposit) {
            // Only giftedStorageDeposit needs adjusting, since that is derived
            // from the amount property instead of the unlock condition
            if (!surplus) {
                storageDeposit = _giftedStorageDeposit
            } else if (surplus >= _giftedStorageDeposit) {
                storageDeposit = 0
            } else {
                storageDeposit = _giftedStorageDeposit - surplus
            }
        } else {
            storageDeposit = _storageDeposit
        }
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await createTransaction(transactionData, $selectedAccount.index, () => closePopup())
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

    onMount(async () => {
        try {
            if (!isFromLayer2) {
                await calculateInitialOutput()
            }
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<SendFlowTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient } })}
    leftButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
    }}
    rightButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
        isBusy: isTransferring,
    }}
>
    <div class="flex flex-row gap-2 justify-between">
        {#if transactionData.type === NewTransactionType.TokenTransfer}
            <TokenAmountTile asset={transactionData.asset} amount={Number(transactionData.rawAmount)} />
        {:else if transactionData.type === NewTransactionType.NftTransfer}
            <NftTile nft={transactionData.nft} />
        {/if}
        {#if visibleSurplus}
            <TokenAmountTile
                asset={$selectedAccountAssets?.[$activeProfile?.network?.id]?.baseCoin}
                amount={visibleSurplus}
                hideTokenInfo
            />
        {/if}
    </div>

    <TransactionDetails
        bind:expirationDate
        bind:timelockDate
        bind:selectedExpirationPeriod
        bind:selectedTimelockPeriod
        bind:giftStorageDeposit
        {storageDeposit}
        {destinationNetwork}
        {disableChangeExpiration}
        disableChangeTimelock={disableChangeExpiration}
        disableGiftStorageDeposit={disableToggleGift}
        disableAll={isTransferring}
    />

    <optional-inputs class="flex flex-row flex-wrap gap-4">
        <AddInputButton
            open={!!selectedExpirationPeriod}
            text={localize('general.expirationTime')}
            onClick={() => (selectedExpirationPeriod = TimePeriod.OneDay)}
        />
        <AddInputButton
            open={!!selectedTimelockPeriod}
            text={localize('general.timelockDate')}
            onClick={() => (selectedTimelockPeriod = TimePeriod.OneDay)}
        />
        <OptionalInput
            bind:this={tagInput}
            bind:value={tag}
            label={localize('general.tag')}
            description={localize('tooltips.optionalInput')}
        />
        {#if !isLayer2}
            <OptionalInput
                bind:this={metadataInput}
                bind:value={metadata}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            />
        {/if}
    </optional-inputs>
</SendFlowTemplate>
