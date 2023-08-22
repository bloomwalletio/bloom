<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { getStorageDepositFromOutput } from '@core/activity/utils/helper'
    import { localize } from '@core/i18n'
    import { estimateGasForLayer1ToLayer2Transaction, getDestinationNetworkFromAddress } from '@core/layer-2/utils'
    import { getNetwork } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { TimePeriod } from '@core/utils/enums'
    import { Output, SendFlowParameters, TokenTransferData } from '@core/wallet'
    import { SendFlowType, updateSendFlowParameters } from '@core/wallet/stores'
    import { AddInputButton, ExpirationTimePicker, OptionalInput, TransactionAssetSection } from '@ui'
    import { onMount } from 'svelte'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'
    import { GAS_MULTIPLIER, calculateGasFeeInGlow, getGasPriceInWei } from '@core/layer-2'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    let {
        expirationDate,
        timelockDate,
        disableChangeExpiration,
        giftStorageDeposit,
        layer2Parameters,
        tag,
        metadata,
        disableToggleGift,
    } = sendFlowParameters

    const destinationNetwork = getDestinationNetworkFromAddress(layer2Parameters?.networkAddress)
    let baseCoinTransfer: TokenTransferData
    let storageDeposit: number
    let estimatedGas = 0
    let gasLimit = 0
    let gasPrice = '0x0'
    let expirationTimePicker: ExpirationTimePicker
    let tagInput: OptionalInput
    let metadataInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: isTransferring = !!$selectedAccount.isTransferring
    $: isToLayer2 = !!layer2Parameters?.networkAddress
    $: updateSendFlowOnChange(expirationDate, timelockDate, giftStorageDeposit, tag, metadata)

    function updateSendFlowOnChange(
        expirationDate: Date,
        timelockDate: Date,
        giftStorageDeposit: boolean,
        tag: string,
        metadata: string
    ): void {
        const hasChanged =
            expirationDate !== sendFlowParameters.expirationDate ||
            timelockDate !== sendFlowParameters.timelockDate ||
            tag !== sendFlowParameters.tag ||
            metadata !== sendFlowParameters.metadata ||
            giftStorageDeposit !== sendFlowParameters.giftStorageDeposit
        if (hasChanged) {
            updateSendFlowParameters({
                type: sendFlowParameters.type,
                expirationDate,
                timelockDate,
                tag,
                metadata,
                giftStorageDeposit,
            })
        }
    }

    async function setGasVariables(sendFlowParameters: SendFlowParameters): Promise<void> {
        estimatedGas = await estimateGasForLayer1ToLayer2Transaction(sendFlowParameters)
        gasLimit = estimatedGas * GAS_MULTIPLIER
        gasPrice = await getGasPriceInWei(layer2Parameters.chainId)
    }
    $: void setGasVariables(sendFlowParameters)

    function setBaseCoinAndStorageDeposit(output: Output, estimatedGas: number): void {
        storageDeposit = getStorageDepositFromOutput(output)
        baseCoinTransfer = {
            token: $selectedAccountTokens?.[getNetwork().getMetadata().id].baseCoin,
            rawAmount: String(Number(output.amount) - storageDeposit - estimatedGas),
        }
    }
    $: setBaseCoinAndStorageDeposit(output, estimatedGas)

    function getTransactionAsset(sendFlowParameters: SendFlowParameters): {
        tokenTransfer?: TokenTransferData
        nft?: INft
    } {
        return {
            ...(sendFlowParameters.type === SendFlowType.TokenTransfer && {
                tokenTransfer: sendFlowParameters.tokenTransfer,
            }),
            ...(sendFlowParameters.type === SendFlowType.NftTransfer && { nft: sendFlowParameters.nft }),
        }
    }

    function getInitialExpirationDate(hasExpirationDate, hasStorageDeposit, giftStorageDeposit): TimePeriod {
        if (hasExpirationDate) {
            return TimePeriod.Custom
        } else if (hasStorageDeposit && !giftStorageDeposit) {
            return TimePeriod.OneDay
        } else {
            return TimePeriod.None
        }
    }

    onMount(() => {
        setBaseCoinAndStorageDeposit(output, estimatedGas)
        selectedExpirationPeriod = getInitialExpirationDate(!!expirationDate, !!storageDeposit, giftStorageDeposit)
    })
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {baseCoinTransfer} {...getTransactionAsset(sendFlowParameters)} />

    <StardustTransactionDetails
        bind:expirationDate
        bind:timelockDate
        bind:selectedExpirationPeriod
        bind:selectedTimelockPeriod
        bind:giftStorageDeposit
        estimatedGasFee={calculateGasFeeInGlow(estimatedGas, gasPrice)}
        maxGasFee={calculateGasFeeInGlow(gasLimit, gasPrice)}
        storageDeposit={getStorageDepositFromOutput(output)}
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
