<script lang="ts">
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'
    import { fade } from 'svelte/transition'
    import { Toggle, Popover, Text, Icon, IconName } from '@bloomwalletio/ui'

    export let storageDeposit: number
    export let giftStorageDeposit: boolean
    export let disabled: boolean = false

    let anchor: HTMLElement | undefined = undefined
    let popover: Popover | undefined = undefined
    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
        popover?.hide()
    }
</script>

<div class="relative" bind:this={anchor}>
    <button
        class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
        {disabled}
        on:click={popover?.show}
    >
        <div class="flex flex-row hover:text-blue-600 items-center gap-1">
            <Text textColor={disabled ? 'secondary' : 'brand'} type="base" fontWeight="medium">
                {giftStorageDeposit
                    ? localize('general.gifted')
                    : formatTokenAmountPrecise(storageDeposit, getBaseToken())}
            </Text>
            {#if !disabled}
                <Icon name={IconName.ChevronDown} size="xxs" textColor="brand" />
            {/if}
        </div>
    </button>
</div>

<Popover
    bind:this={popover}
    {anchor}
    placement="top-end"
    class="border border-solid border-purple-50 rounded-xl shadow-lg overflow-hidden"
>
    <gift-storage-deposit-modal
        class="flex flex-row justify-between items-center p-4 gap-4"
        in:fade={{ duration: 100 }}
    >
        <div class="flex flex-col text-left">
            <Text>{localize('popups.giftedStorageDeposit.tooltipTitle')}</Text>
            <Text color="secondary" fontWeight="normal">
                {localize('popups.giftedStorageDeposit.tooltipDescription')}
            </Text>
        </div>
        <Toggle label="" checked={giftStorageDeposit} onClick={toggleGiftStorageDeposit} />
    </gift-storage-deposit-modal>
</Popover>
