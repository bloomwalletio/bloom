<script lang="ts">
    import { Popover, Text, Toggle } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmount } from '@core/token'
    import { fade } from 'svelte/transition'

    export let storageDeposit: bigint
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
    <button class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}" {disabled}>
        <div class="flex flex-row items-center">
            <Text textColor={disabled ? 'secondary' : 'brand'} type="base" fontWeight="medium">
                {giftStorageDeposit ? localize('general.gifted') : formatTokenAmount(storageDeposit, getBaseToken())}
            </Text>
        </div>
    </button>
</div>

<Popover
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
</Popover>
