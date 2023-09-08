<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { getStorageDepositFromOutput } from '@core/activity/utils/helper'
    import { localize } from '@core/i18n'
    import { getActiveNetworkId, isEvmChain } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { TimePeriod } from '@core/utils/enums'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData } from '@core/wallet'
    import { updateSendFlowParameters } from '@core/wallet/stores'
    import { AddInputButton, OptionalInput, TransactionAssetSection } from '@ui'
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

    let storageDeposit: number
    let tagInput: OptionalInput
    let metadataInput: OptionalInput

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: isTransferring = !!$selectedAccount.isTransferring
    $: updateSendFlowOnChange(expirationDate, timelockDate, giftStorageDeposit, tag, metadata)
    $: storageDeposit = getStorageDepositFromOutput(output)

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

    function disableGiftingStorageDeposit(isToLayer2: boolean) {
        if (isToLayer2) {
            disableToggleGift = true
            giftStorageDeposit = true
        }
    }

    $: transactionFee = isToLayer2
        ? sendFlowParameters.type === SendFlowType.BaseCoinTransfer
            ? String(Number(output.amount) - Number(sendFlowParameters.baseCoinTransfer.rawAmount))
            : output.amount
        : 0

    function getTransactionAssets(
        output: Output,
        sendFlowParameters: SendFlowParameters
    ): {
        nft?: INft
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        const baseCoin = $selectedAccountTokens?.[getActiveNetworkId()].baseCoin

        if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
            return {
                baseCoinTransfer: {
                    token: baseCoin,
                    rawAmount: isToLayer2
                        ? sendFlowParameters.baseCoinTransfer.rawAmount
                        : String(Number(output.amount) - storageDeposit),
                },
            }
        } else {
            const baseCoinTransfer = {
                token: baseCoin,
                rawAmount: isToLayer2 ? '0' : String(Number(output.amount) - storageDeposit),
            }
            if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
                return {
                    tokenTransfer: sendFlowParameters.tokenTransfer,
                    baseCoinTransfer,
                }
            } else {
                return {
                    nft: sendFlowParameters.nft,
                    baseCoinTransfer,
                }
            }
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
        storageDeposit = getStorageDepositFromOutput(output)
        selectedExpirationPeriod = getInitialExpirationDate(!!expirationDate, !!storageDeposit, giftStorageDeposit)
    })
</script>

<div class="w-full space-y-4">
    <TransactionAssetSection {...getTransactionAssets(output, sendFlowParameters)} />

    <StardustTransactionDetails
        bind:expirationDate
        bind:timelockDate
        bind:selectedExpirationPeriod
        bind:selectedTimelockPeriod
        bind:giftStorageDeposit
        storageDeposit={getStorageDepositFromOutput(output)}
        {transactionFee}
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
