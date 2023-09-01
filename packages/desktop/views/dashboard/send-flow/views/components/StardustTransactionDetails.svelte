<script lang="ts">
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { TimePeriod } from '@core/utils'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkAvatar, Text, TooltipIcon } from '@ui'
    import { NetworkId } from '@core/network'
    import DateTimePickerButton from './DateTimePickerButton.svelte'
    import StorageDepositButton from './StorageDepositButton.svelte'
    import { getNameFromNetworkId } from '@core/network/actions/getNameFromNetworkId'

    export let destinationNetworkId: NetworkId
    export let storageDeposit: number
    export let transactionFee: BigIntLike | undefined = undefined
    export let giftStorageDeposit: boolean
    export let expirationDate: Date
    export let selectedExpirationPeriod: TimePeriod
    export let selectedTimelockPeriod: TimePeriod
    export let timelockDate: Date
    export let disableChangeExpiration: boolean
    export let disableChangeTimelock: boolean
    export let disableGiftStorageDeposit: boolean
    export let disableAll: boolean
    export let isToLayer2: boolean = false

    $: destinationNetwork = getNameFromNetworkId(destinationNetworkId)
</script>

<div class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg">
    {#if destinationNetworkId}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <Text>{localize('general.destinationNetwork')}</Text>
            <div class="flex flex-row items-center gap-2">
                <NetworkAvatar networkId={destinationNetworkId} size="xs" />
                <Text color="gray-600">{destinationNetwork}</Text>
            </div>
        </section>
    {/if}
    {#if storageDeposit || (giftStorageDeposit && !isToLayer2)}
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
    {#if transactionFee}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.gasFee')}</Text>
            </div>
            <Text color="gray-600">{formatTokenAmountBestMatch(Number(transactionFee), getBaseToken())}</Text>
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
        @apply flex flex-row justify-between items-center p-4;
        @apply border-b border-solid;

        &:last-child {
            @apply border-0;
        }
    }
</style>
