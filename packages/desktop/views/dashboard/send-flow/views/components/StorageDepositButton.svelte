<script lang="ts">
    import { Icon, IconName, Popover, Text, Toggle } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'
    import { fade } from 'svelte/transition'

    export let storageDeposit: number
    export let giftStorageDeposit: boolean
    export let disabled: boolean = false

    let popover: Popover | undefined
    let anchor: HTMLElement | undefined

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
        popover?.hide()
    }

    function onClick(): void {
        popover?.show()
    }
</script>

<div class="relative">
    <button
        bind:this={anchor}
        on:click={onClick}
        class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
        {disabled}
    >
        <div class="flex flex-row hover:text-blue-600 items-center">
            <Text
                highlighted={!disabled}
                color="gray-600"
                darkColor="gray-500"
                classes={disabled ? '' : 'hover:text-blue-600'}
            >
                {giftStorageDeposit
                    ? localize('general.gifted')
                    : formatTokenAmountPrecise(storageDeposit, getBaseToken())}
            </Text>
            {#if !disabled}
                <Icon name={IconName.ChevronDown} size="xxs" />
            {/if}
        </div>
    </button>
</div>
<Popover {anchor} bind:this={popover} placement="top-end" size="large">
    <gift-storage-deposit-modal class="flex flex-row justify-between items-center p-4" in:fade={{ duration: 100 }}>
        <div class="flex flex-col">
            <Text>{localize('popups.giftedStorageDeposit.tooltipTitle')}</Text>
            <Text>{localize('popups.giftedStorageDeposit.tooltipDescription')}</Text>
        </div>
        <Toggle label="giftStorageDeposit" checked={giftStorageDeposit} onClick={toggleGiftStorageDeposit} />
    </gift-storage-deposit-modal>
</Popover>
