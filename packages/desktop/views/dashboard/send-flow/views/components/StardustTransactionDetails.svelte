<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { TimePeriod } from '@core/utils'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkLabel, Text, TooltipIcon } from '@ui'
    import { NetworkId } from '@core/network'
    import StorageDepositButton from './StorageDepositButton.svelte'
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

    $: items = [
        {
            key: localize('general.destinationNetwork'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId: destinationNetworkId,
                },
            },
            show: destinationNetworkId,
        },
    ]
</script>

<Table items={items.filter((item) => item.show)} />

<div class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg">
    {#if storageDeposit}
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
            <div>
                <DateTimePickerMenu
                    bind:value={expirationDate}
                    bind:selected={selectedExpirationPeriod}
                    disabled={disableChangeExpiration || disableAll}
                />
            </div>
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
            <div>
                <DateTimePickerMenu
                    bind:value={timelockDate}
                    bind:selected={selectedTimelockPeriod}
                    disabled={disableChangeTimelock || disableAll}
                />
            </div>
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
