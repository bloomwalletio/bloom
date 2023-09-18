<script lang="ts">
    import { onMount } from 'svelte'
    import { AddInputButton, OptionalInput, TransactionAssetSection } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { getStorageDepositFromOutput } from '@core/activity/utils/helper'
    import { localize } from '@core/i18n'
    import { getActiveNetworkId } from '@core/network'
    import { INft } from '@core/nfts/interfaces'
    import { selectedAccountTokens } from '@core/token/stores'
    import { TimePeriod } from '@core/utils/enums'
    import { Output, SendFlowParameters, SendFlowType, TokenTransferData, validateTag } from '@core/wallet'
    import { updateSendFlowParameters } from '@core/wallet/stores'
    import StardustTransactionDetails from './StardustTransactionDetails.svelte'

    export let output: Output
    export let sendFlowParameters: SendFlowParameters
    export let isDisabled: boolean = false

    function validate(): void {
        tagInputError = ''
        try {
            validateTag(tag)
            isDisabled = false
        } catch (err) {
            tagInputError = err.message
            isDisabled = true
        }
    }

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
    let tagInputError = ''

    let selectedExpirationPeriod: TimePeriod | undefined = expirationDate ? TimePeriod.Custom : undefined
    let selectedTimelockPeriod: TimePeriod | undefined = timelockDate ? TimePeriod.Custom : undefined

    $: isTransferring = !!$selectedAccount.isTransferring
    $: updateSendFlowOnChange(expirationDate, timelockDate, giftStorageDeposit, tag, metadata)
    $: storageDeposit = getStorageDepositFromOutput(output)
    $: tag, validate()

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

    function getTransactionAssets(
        output: Output,
        sendFlowParameters: SendFlowParameters
    ): {
        nft?: INft
        tokenTransfer?: TokenTransferData
        baseCoinTransfer?: TokenTransferData
    } {
        const baseCoin = $selectedAccountTokens?.[getActiveNetworkId()].baseCoin
        const baseCoinTransfer = {
            token: baseCoin,
            rawAmount: String(Number(output.amount) - storageDeposit),
        }

        switch (sendFlowParameters.type) {
            case SendFlowType.BaseCoinTransfer:
                return { baseCoinTransfer }
            case SendFlowType.TokenTransfer:
                return {
                    tokenTransfer: sendFlowParameters.tokenTransfer,
                    baseCoinTransfer,
                }
            case SendFlowType.NftTransfer:
                return {
                    nft: sendFlowParameters.nft,
                    baseCoinTransfer,
                }
        }
    }

    function getInitialExpirationDate(
        hasExpirationDate: boolean,
        hasStorageDeposit: boolean,
        giftStorageDeposit: boolean
    ): TimePeriod {
        if (hasExpirationDate) {
            return TimePeriod.Custom
        } else if (hasStorageDeposit && !giftStorageDeposit) {
            return TimePeriod.OneDay
        } else {
            return TimePeriod.None
        }
    }

    onMount((): void => {
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
        {storageDeposit}
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
            bind:value={tag}
            error={tagInputError}
            label={localize('general.tag')}
            description={localize('tooltips.optionalInput')}
        />
        <OptionalInput
            bind:value={metadata}
            disabled={isTransferring}
            label={localize('general.metadata')}
            description={localize('tooltips.optionalInput')}
        />
    </optional-inputs>
</div>
