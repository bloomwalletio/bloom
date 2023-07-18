<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress, estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/utils'
    import { TimePeriod } from '@core/utils/enums'
    import { NewTransactionType, updateNewTransactionData } from '@core/wallet/stores'
    import { AddInputButton, ExpirationTimePicker, OptionalInput } from '@ui'
    import { getStorageDepositFromOutput } from '@core/wallet/utils'
    import { onMount } from 'svelte'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'
    import { Output, TransactionData } from '@core/wallet'
    import TransactionAssetSection from './TransactionAssetSection.svelte'
    import { DisplayedAsset } from '../types'

    export let output: Output
    export let transactionData: TransactionData

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
    } = transactionData

    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    let storageDeposit = 0
    let visibleSurplus = 0
    let estimatedGas = 0
    let expirationTimePicker: ExpirationTimePicker
    let tagInput: OptionalInput
    let metadataInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

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

    function getTransactionAssets(transactionData: TransactionData): {
        displayedAsset: DisplayedAsset
        visibleSurplus: number
    } {
        let displayedAsset: DisplayedAsset
        if (transactionData.type === NewTransactionType.TokenTransfer) {
            displayedAsset = { type: 'token', asset: transactionData.asset, rawAmount: transactionData.rawAmount }
        } else {
            displayedAsset = { type: 'nft', nft: transactionData.nft }
        }
        return { displayedAsset, visibleSurplus }
    }

    onMount(() => {
        setStorageDeposit(output, Number(surplus))
        selectedExpirationPeriod = getInitialExpirationDate()
    })
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {...getTransactionAssets(transactionData)} />

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
