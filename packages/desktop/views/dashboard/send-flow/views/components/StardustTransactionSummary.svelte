<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress, estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/utils'
    import { TimePeriod } from '@core/utils/enums'
    import { NewTransactionType, newTransactionData, updateNewTransactionData } from '@core/wallet/stores'
    import { AddInputButton, ExpirationTimePicker, OptionalInput } from '@ui'
    import { getStorageDepositFromOutput } from '@core/wallet/utils'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'
    import { Output } from '@core/wallet'
    import TransactionAssetSection from './TransactionAssetSection.svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let output: Output

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
    let estimatedGas = 0
    let expirationTimePicker: ExpirationTimePicker
    let tagInput: OptionalInput
    let metadataInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: transactionData = get(newTransactionData)
    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: isTransferring = !!$selectedAccount.isTransferring
    $: isToLayer2 = !!layer2Parameters?.networkAddress
    $: transactionData, void setEstimatedGas()
    $: expirationDate, timelockDate, giftStorageDeposit, refreshSendConfirmationState()

    function refreshSendConfirmationState(): void {
        updateNewTransactionData({
            type: transactionData.type,
            expirationDate,
            timelockDate,
            giftStorageDeposit,
            surplus,
        })
        setStorageDeposit(output, Number(surplus))
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

    async function setEstimatedGas(): Promise<void> {
        estimatedGas = await estimateGasForLayer1ToLayer2Transaction(transactionData)
    }

    function initializeExpirationInput(): void {
        setStorageDeposit(output, Number(surplus))
        selectedExpirationPeriod = getInitialExpirationDate()
    }

    function setStorageDeposit(output: Output, surplus?: number): void {
        const rawAmount = transactionData.type === NewTransactionType.TokenTransfer ? transactionData.rawAmount : '0'

        const { storageDeposit: _storageDeposit, giftedStorageDeposit: _giftedStorageDeposit } =
            getStorageDepositFromOutput(output, rawAmount)

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

    onMount(async () => {
        try {
            initializeExpirationInput()
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {transactionData} {visibleSurplus} />

    <StardustTransactionDetails
        bind:expirationDate
        bind:timelockDate
        bind:selectedExpirationPeriod
        bind:selectedTimelockPeriod
        bind:giftStorageDeposit
        gasBudget={estimatedGas}
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
            disabled={isTransferring}
            text={localize('general.expirationTime')}
            onClick={() => (selectedExpirationPeriod = TimePeriod.OneDay)}
        />
        <AddInputButton
            open={!!selectedTimelockPeriod}
            disabled={isTransferring}
            text={localize('general.timelockDate')}
            onClick={() => (selectedTimelockPeriod = TimePeriod.OneDay)}
        />
        <OptionalInput
            bind:this={tagInput}
            bind:value={tag}
            disabled={isTransferring}
            label={localize('general.tag')}
            description={localize('tooltips.optionalInput')}
        />
        {#if !isToLayer2}
            <OptionalInput
                bind:this={metadataInput}
                bind:value={metadata}
                disabled={isTransferring}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            />
        {/if}
    </optional-inputs>
</div>
