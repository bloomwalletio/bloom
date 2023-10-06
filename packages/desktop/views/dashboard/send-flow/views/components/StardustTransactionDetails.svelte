<script lang="ts">
    import { Table, TableRow, Toggle } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch, formatTokenAmountPrecise } from '@core/token'
    import { TimePeriod } from '@core/utils'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkLabel } from '@ui'
    import { NetworkId } from '@core/network'
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

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
    }

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
            key: localize('general.storageDeposit'),
            value: formatTokenAmountPrecise(storageDeposit ?? 0, getBaseToken()),
            tooltip: localize('tooltips.transactionDetails.outgoing.storageDeposit'),
            show: storageDeposit,
        },
        {
            key: localize('actions.giftStorageDeposit'),
            slot: {
                component: Toggle,
                props: {
                    onClick: toggleGiftStorageDeposit,
                    label: 'giftStorageDeposit',
                },
                value: giftStorageDeposit,
            },
            show: disableGiftStorageDeposit || disableAll || storageDeposit,
        },
        {
            key: localize('general.transactionFee'),
            value: formatTokenAmountBestMatch(Number(transactionFee), getBaseToken()),
            show: transactionFee,
        },
    ]
</script>

<Table items={items.filter((item) => item.show)}>
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
