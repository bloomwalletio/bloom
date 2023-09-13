<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
</script>

<wallet-summary-balance class="border-right w-full h-full p-6 flex flex-col justify-between">
    <wallet-summary-balance-header class="w-full flex flex-row justify-between items-center">
        <Text type="h6" align="center" truncate>Wallet</Text>
        <button type="button" class="menu"></button>
    </wallet-summary-balance-header>
    <wallet-summary-balance-amount>
        <Text type="h6" align="center" truncate>$8,567.23</Text>
    </wallet-summary-balance-amount>
    <wallet-summary-balance-actions class="mt-4">
        <Button text="Send" width="full" icon={IconName.TrendUp} />
    </wallet-summary-balance-actions>
</wallet-summary-balance>

<style lang="postcss">
    .menu {
        @apply relative mx-2;
    }

    .menu,
    .menu::before,
    .menu::after {
        @apply w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-100;
    }

    .menu::before,
    .menu::after {
        @apply absolute top-0;
        content: '';
    }

    .menu::before {
        @apply -left-1.5;
    }

    .menu::after {
        @apply -right-1.5;
    }
</style>
