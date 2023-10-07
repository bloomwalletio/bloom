<script lang="ts">
    import { Table, TableRow } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { TimePeriod } from '@core/utils'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkLabel } from '@ui'
    import { NetworkId } from '@core/network'
    import { DateTimePickerMenu } from '.'
    import StorageDepositButton from './StorageDepositButton.svelte'

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
        {
            key: localize('general.transactionFee'),
            value: formatTokenAmountBestMatch(Number(transactionFee), getBaseToken()),
            show: transactionFee,
        },
    ]
</script>

<Table items={items.filter((item) => item.show)}>
    {#if storageDeposit || giftStorageDeposit}
        <TableRow
            item={{
                key: localize('general.storageDeposit'),
                tooltip: localize('tooltips.transactionDetails.outgoing.storageDeposit'),
            }}
        >
            <div slot="boundValue">
                <StorageDepositButton
                    bind:giftStorageDeposit
                    {storageDeposit}
                    disabled={disableGiftStorageDeposit || disableAll}
                />
            </div>
        </TableRow>
    {/if}
    {#if selectedExpirationPeriod}
        <TableRow
            item={{
                key: localize('general.expirationTime'),
                tooltip: localize('tooltips.transactionDetails.outgoing.expirationTime'),
            }}
        >
            <div slot="boundValue">
                <DateTimePickerMenu
                    bind:value={expirationDate}
                    bind:selected={selectedExpirationPeriod}
                    disabled={disableChangeExpiration || disableAll}
                />
            </div>
        </TableRow>
    {/if}
    {#if selectedTimelockPeriod}
        <TableRow
            item={{
                key: localize('general.timelockDate'),
                tooltip: localize('tooltips.transactionDetails.outgoing.timelockDate'),
            }}
        >
            <div slot="boundValue">
                <DateTimePickerMenu
                    bind:value={timelockDate}
                    bind:selected={selectedTimelockPeriod}
                    disabled={disableChangeTimelock || disableAll}
                />
            </div>
        </TableRow>
    {/if}
</Table>
