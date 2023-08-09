<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile'
    import { formatTokenAmountPrecise } from '@core/token'
    import { FontWeight, Icon, Modal, Text, Toggle } from '@ui'
    import { fade } from 'svelte/transition'

    export let storageDeposit: number
    export let giftStorageDeposit: boolean
    export let disabled: boolean = false

    let modal: Modal | undefined

    function toggleGiftStorageDeposit(): void {
        giftStorageDeposit = !giftStorageDeposit
        modal?.close()
    }
</script>

<div class="relative">
    <button
        class="flex items-center justify-center {disabled ? 'cursor-default' : 'cursor-pointer'}"
        {disabled}
        on:click={modal?.open}
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
                <Icon icon={IconEnum.ChevronDown} width="10" height="13" classes="text-blue-500 ml-1" />
            {/if}
        </div>
    </button>
    <Modal bind:this={modal} position={{ bottom: '30px', right: '0px' }} size="large">
        <gift-storage-deposit-modal class="flex flex-row justify-between items-center p-4" in:fade={{ duration: 100 }}>
            <div class="flex flex-col">
                <Text fontWeight={FontWeight.medium}
                    >{localize('popups.transactionDetails.giftedStorageDeposit.tooltipTitle')}</Text
                >
                <Text fontWeight={FontWeight.medium} color="gray-600" darkColor="gray-400"
                    >{localize('popups.transactionDetails.giftedStorageDeposit.tooltipDescription')}</Text
                >
            </div>
            <Toggle color="green" active={giftStorageDeposit} onClick={toggleGiftStorageDeposit} />
        </gift-storage-deposit-modal>
    </Modal>
</div>
