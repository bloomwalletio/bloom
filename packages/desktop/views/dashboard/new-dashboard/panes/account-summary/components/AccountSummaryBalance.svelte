<script lang="ts">
    import { Button, IconButton, IconName, Text } from '@bloomwalletio/ui'
</script>

<wallet-summary-balance class="w-full h-full p-6 flex flex-col justify-between">
    <wallet-summary-balance-header class="w-full flex flex-row justify-between items-center">
        <Text type="h6" align="center" truncate>Wallet</Text>
        <IconButton name={IconName.DotsHorizontal} />
    </wallet-summary-balance-header>
    <wallet-summary-balance-amount>
        <Text type="h6" size="6xl" align="center" truncate>$8,567.23</Text>
    </wallet-summary-balance-amount>
    <wallet-summary-balance-actions class="mt-4 flex flex-row justify-between items-center">
        <Button text="Send" width="full" size="lg" icon={IconName.Send} />
    </wallet-summary-balance-actions>
</wallet-summary-balance>
