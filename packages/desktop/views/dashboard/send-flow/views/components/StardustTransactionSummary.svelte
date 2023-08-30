<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { getStorageDepositFromOutput } from '@core/activity/utils/helper'
    import { localize } from '@core/i18n'
    import { getGasFeesForLayer1ToLayer2Transaction } from '@core/layer-2/actions'
    import { getNetwork, isEvmChain } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { TimePeriod } from '@core/utils/enums'
    import { Output, SendFlowParameters, TokenTransferData } from '@core/wallet'
    import { SendFlowType, updateSendFlowParameters } from '@core/wallet/stores'
    import { BigIntLike } from '@ethereumjs/util'
    import { AddInputButton, ExpirationTimePicker, OptionalInput, TransactionAssetSection } from '@ui'
    import { onMount } from 'svelte'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters

    let {
        expirationDate,
        timelockDate,
        disableChangeExpiration,
        giftStorageDeposit,
        destinationNetworkId,
        tag,
        metadata,
        disableToggleGift,
    } = sendFlowParameters

    let baseCoinTransfer: TokenTransferData
    let storageDeposit: number
    let expirationTimePicker: ExpirationTimePicker
    let tagInput: OptionalInput
    let metadataInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: expirationTimePicker?.setNull(giftStorageDeposit)
    $: isTransferring = !!$selectedAccount.isTransferring
    $: updateSendFlowOnChange(expirationDate, timelockDate, giftStorageDeposit, tag, metadata)

    const isToLayer2 = destinationNetworkId && isEvmChain(destinationNetworkId)
    disableGiftingStorageDeposit(isToLayer2)

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

    let estimatedGasFee: BigIntLike | undefined = undefined
    let maxGasFee: BigIntLike | undefined = undefined
    async function setGasVariables(sendFlowParameters: SendFlowParameters): Promise<void> {
        if (isToLayer2) {
            const gasFees = await getGasFeesForLayer1ToLayer2Transaction(sendFlowParameters)
            estimatedGasFee = gasFees.estimatedGasFee
            maxGasFee = gasFees.maxGasFee
        }
    }
    $: void setGasVariables(sendFlowParameters)

    function disableGiftingStorageDeposit(isToLayer2: boolean) {
        if (isToLayer2) {
            disableToggleGift = true
            giftStorageDeposit = true
        }
    }

    function setBaseCoinAndStorageDeposit(output: Output, maxGasFee: BigIntLike | undefined): void {
        storageDeposit = getStorageDepositFromOutput(output)
        baseCoinTransfer = {
            token: $selectedAccountTokens?.[getNetwork().getMetadata().id].baseCoin,
            rawAmount: String(Number(output.amount) - storageDeposit - Number(maxGasFee ?? 0)),
        }
    }
    $: setBaseCoinAndStorageDeposit(output, maxGasFee)

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
        setBaseCoinAndStorageDeposit(output, maxGasFee)
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
        {estimatedGasFee}
        {maxGasFee}
        storageDeposit={getStorageDepositFromOutput(output)}
        {destinationNetworkId}
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
