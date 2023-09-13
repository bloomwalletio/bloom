<script lang="ts">
    import { Indicator, Text } from '@bloomwalletio/ui'
    import { AccountSwitcherModal } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { Modal } from '@ui'

    let modal: Modal
    let isModalOpened: boolean = false

    function onOutsideClick(): void {
        isModalOpened = modal?.isOpened()
    }

    function onButtonClick(): void {
        modal?.toggle()
    }
</script>

<svelte:window on:click={onOutsideClick} />
<button
    type="button"
    on:click={onButtonClick}
    class="flex flex-row justify-center items-center space-x-2 px-2 pt-0.5 rounded-md cursor-pointer"
>
    <Indicator color={$selectedAccount?.color} size="sm" />
    <Text size="sm" weight="semibold" color="#1E1B4E">
        {$selectedAccount?.name}
    </Text>
</button>
<AccountSwitcherModal bind:modal />

<style lang="scss">
    button:hover {
        @apply bg-purple-100;
    }
</style>
