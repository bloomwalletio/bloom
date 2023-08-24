<script lang="ts">
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { TimePeriod } from '@core/utils'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkIcon, Text, TooltipIcon } from '@ui'
    import { SupportedNetworkId } from '@core/network'
    import DateTimePickerButton from './DateTimePickerButton.svelte'
    import StorageDepositButton from './StorageDepositButton.svelte'

    export let destinationNetwork: string
    export let storageDeposit: number
    export let estimatedGasFee: BigIntLike | undefined = undefined
    export let maxGasFee: BigIntLike | undefined = undefined
    export let giftStorageDeposit: boolean
    export let expirationDate: Date
    export let selectedExpirationPeriod: TimePeriod
    export let selectedTimelockPeriod: TimePeriod
    export let timelockDate: Date
    export let disableChangeExpiration: boolean
    export let disableChangeTimelock: boolean
    export let disableGiftStorageDeposit: boolean
    export let disableAll: boolean
</script>

<div class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg">
    {#if destinationNetwork}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <Text>{localize('general.destinationNetwork')}</Text>
            <div class="flex flex-row gap-2">
                <!-- TODO: Add correct icon for L2 -->
                <NetworkIcon networkId={SupportedNetworkId.Testnet} height={16} width={16} outlined={false} />
                <Text color="gray-600">{destinationNetwork}</Text>
            </div>
        </section>
    {/if}
    {#if storageDeposit || giftStorageDeposit}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.storageDeposit')}</Text>
                <TooltipIcon
                    title={localize('general.storageDeposit')}
                    text={localize('tooltips.transactionDetails.outgoing.storageDeposit')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <StorageDepositButton
                bind:giftStorageDeposit
                {storageDeposit}
                disabled={disableGiftStorageDeposit || disableAll}
            />
        </section>
    {/if}
    {#if estimatedGasFee}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.estimatedFee')}</Text>
            </div>
            <Text color="gray-600">{formatTokenAmountBestMatch(Number(estimatedGasFee), getBaseToken())}</Text>
        </section>
    {/if}
    {#if maxGasFee}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.maxFees')}</Text>
            </div>
            <Text color="gray-600">{formatTokenAmountBestMatch(Number(maxGasFee), getBaseToken())}</Text>
        </section>
    {/if}
    {#if selectedExpirationPeriod}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.expirationTime')}</Text>
                <TooltipIcon
                    title={localize('general.expirationTime')}
                    text={localize('tooltips.transactionDetails.outgoing.expirationTime')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <DateTimePickerButton
                bind:value={expirationDate}
                bind:selected={selectedExpirationPeriod}
                disabled={disableChangeExpiration || disableAll}
            />
        </section>
    {/if}
    {#if selectedTimelockPeriod}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.timelockDate')}</Text>
                <TooltipIcon
                    title={localize('general.timelockDate')}
                    text={localize('tooltips.transactionDetails.outgoing.timelockDate')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <DateTimePickerButton
                bind:value={timelockDate}
                bind:selected={selectedTimelockPeriod}
                disabled={disableChangeTimelock || disableAll}
            />
        </section>
    {/if}
</div>

<style lang="scss">
    .key-value-box {
        @apply flex flex-row justify-between p-4;
        @apply border-b border-solid;

        &:last-child {
            @apply border-0;
        }
    }
</style>
