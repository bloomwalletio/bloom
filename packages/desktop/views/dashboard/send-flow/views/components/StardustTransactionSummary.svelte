<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress, estimateGasForLayer1ToLayer2Transaction } from '@core/layer-2/utils'
    import { activeProfile } from '@core/profile/stores'
    import { TimePeriod } from '@core/utils/enums'
    import {
        NewTransactionType,
        newTransactionData,
        selectedAccountAssets,
        updateNewTransactionData,
    } from '@core/wallet/stores'
    import { AddInputButton, ExpirationTimePicker, NftTile, OptionalInput, TokenAmountTile } from '@ui'
    import { getStorageDepositFromOutput, prepareOutputFromTransactionData } from '@core/wallet/utils'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'
    import { Output } from '@core/wallet'

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
    let estimatedGas = 0
    let expirationTimePicker: ExpirationTimePicker
    let metadataInput: OptionalInput
    let tagInput: OptionalInput

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
        void prepareTransactionOutput()
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

    async function calculateInitialOutput(): Promise<void> {
        await prepareTransactionOutput()
        selectedExpirationPeriod = getInitialExpirationDate()
    }

    async function prepareTransactionOutput(): Promise<void> {
        if ($selectedAccount.index === undefined) {
            return
        }

        try {
            const preparedOutput = await prepareOutputFromTransactionData($selectedAccount.index)
            setStorageDeposit(preparedOutput, Number(surplus))
        } catch (error) {
            console.error(error)
        }
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
            await calculateInitialOutput()
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full space-y-4">
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
        {#if !isToLayer2}
            <OptionalInput
                bind:this={metadataInput}
                bind:value={metadata}
                label={localize('general.metadata')}
                description={localize('tooltips.optionalInput')}
            />
        {/if}
    </optional-inputs>
</div>
