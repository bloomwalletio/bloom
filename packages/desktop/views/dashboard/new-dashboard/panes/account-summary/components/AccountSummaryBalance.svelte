<script lang="ts">
    import { Button, IconButton, IconName, Text } from '@bloomwalletio/ui'
</script>

<account-summary-balance class="w-full h-full p-6 flex flex-col justify-between">
    <account-summary-balance-header class="w-full flex flex-row justify-between items-center">
        <Text type="h6" align="center" truncate>Wallet</Text>
        <IconButton icon={IconName.DotsHorizontal} />
    </account-summary-balance-header>
    <account-summary-balance-amount>
        <Text type="h6" size="6xl" align="center" truncate>$8,567.23</Text>
    </account-summary-balance-amount>
    <account-summary-balance-actions class="mt-4 flex flex-row justify-between items-center">
        <Button text="Send" width="full" size="lg" icon={IconName.Send} />
    </account-summary-balance-actions>
</account-summary-balance>
