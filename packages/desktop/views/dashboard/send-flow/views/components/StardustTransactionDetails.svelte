<script lang="ts">
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { TimePeriod } from '@core/utils'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkAvatar, Text, TooltipIcon } from '@ui'
    import { NetworkId } from '@core/network'
    import StorageDepositButton from './StorageDepositButton.svelte'
    import { getNameFromNetworkId } from '@core/network/actions/getNameFromNetworkId'
    import { DateTimePickerMenu } from '.'

    export let destinationNetworkId: NetworkId = undefined
    export let storageDeposit: number | undefined = undefined
    export let transactionFee: BigIntLike | undefined = undefined
    export let giftStorageDeposit: boolean | undefined = undefined
    export let expirationDate: Date | undefined = undefined
    export let selectedExpirationPeriod: TimePeriod | undefined = undefined
    export let selectedTimelockPeriod: TimePeriod | undefined = undefined
    export let timelockDate: Date | undefined = undefined
    export let disableChangeExpiration: boolean | undefined = undefined
    export let disableChangeTimelock: boolean | undefined = undefined
    export let disableGiftStorageDeposit: boolean | undefined = undefined
    export let disableAll: boolean | undefined = undefined

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
    {#if transactionFee}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.transactionFee')}</Text>
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
            <DateTimePickerMenu
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
            <DateTimePickerMenu
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
