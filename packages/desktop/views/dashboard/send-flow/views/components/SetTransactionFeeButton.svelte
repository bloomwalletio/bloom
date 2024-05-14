<script lang="ts">
    import { IconName, Menu, Popover, Text, Toggle } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IGasPrices } from '@core/layer-2/interfaces'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmount } from '@core/token'
    import { fade } from 'svelte/transition'

    export let gasPrices: IGasPrices | undefined
    export let selected: bigint = gasPrices?.slow
    export let disabled: boolean = false

    let menu: Menu | undefined
    let anchor: HTMLElement | undefined = undefined

    function onChooseGasPriceClick(amount?: bigint): void {
        if ( amount )
        selected = amount
    }
</script>

<div class="relative" bind:this={anchor}>
    <button class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}" {disabled}>
        <div class="flex flex-row items-center">
            <Text textColor={disabled ? 'secondary' : 'brand'} type="base" fontWeight="medium">
                {localize('general.gifted')}
            </Text>
        </div>
    </button>
</div>

<Menu
    bind:this={menu}
    {disabled}
    compact={false}
    placement="top-end"
    items={[
        {
            icon: IconName.ClockPlus,
            title: localize('general.slow'),
            subtitle: gasPrices?.slow.toString(),
            selected: selected === gasPrices?.slow,
            onClick: () => onChooseGasPriceClick(gasPrices?.slow),
        },
        {
            icon: IconName.CalendarDate,
            title: localize('general.average'),
            subtitle: gasPrices?.average.toString(),
            selected: selected === gasPrices?.average,
            onClick: () => onChooseGasPriceClick(gasPrices?.average),
        },
        {
            icon: IconName.CalendarPlus,
            title: localize('general.fast'),
            subtitle: gasPrices?.fast.toString(),
            selected: selected === gasPrices?.fast,
            onClick: () => onChooseGasPriceClick(gasPrices?.fast),
        },
    ]}
>
</Menu>
<!-- <Popover
    bind:this={popover}
    {anchor}
    event={disabled ? undefined : 'click'}
    placement="top-end"
    class="border border-solid border-stroke dark:border-stroke-dark rounded-xl shadow-lg overflow-hidden"
>
    <gift-storage-deposit-modal
        class="flex flex-row justify-between items-center p-4 gap-4"
        in:fade|global={{ duration: 100 }}
    >
        <div class="flex flex-col text-left">
            <Text>{localize('popups.giftedStorageDeposit.tooltipTitle')}</Text>
            <Text type="xs" textColor="secondary">
                {localize('popups.giftedStorageDeposit.tooltipDescription')}
            </Text>
        </div>
        <Toggle label="" checked={giftStorageDeposit} onClick={toggleGiftStorageDeposit} />
    </gift-storage-deposit-modal>
</Popover> -->
