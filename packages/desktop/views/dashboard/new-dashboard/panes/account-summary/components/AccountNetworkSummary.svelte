<script lang="ts">
    import { Avatar, Text } from '@bloomwalletio/ui'
    import { NetworkAvatar, NetworkStatusIndicator } from '@ui'
    import { NetworkHealth } from '@core/network'
    import { getActiveNetworkId } from '@core/network/actions'
</script>

<account-network-summary class="w-full flex flex-col justify-between">
    <account-network-summary-header class="flex flex-row justify-between items-center">
        <div class="flex flex-row space-x-3 items-center">
            <NetworkAvatar networkId={getActiveNetworkId()} />
            <Text type="h6" align="center" truncate>Shimmer</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            <NetworkStatusIndicator disablePing status={NetworkHealth.Operational} />
            <Text type="pre" align="center" truncate>d4x6...x674a</Text>
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="middle flex flex-col justify-between items-start">
        <account-network-summary-balance-primary>
            <Text type="p" weight="semibold" size="3xl" align="center" truncate>1,095.54 SMR</Text>
        </account-network-summary-balance-primary>
        <account-network-summary-balance-secondary>
            <Text type="p" weight="semibold" align="center" truncate>$3,182.20</Text>
        </account-network-summary-balance-secondary>
    </account-network-summary-balance>
    <account-network-summary-assets class="flex flex-row justify-between items-center">
        <Avatar backgroundColor="indigo-950" shape="square" text="8" />
        <Avatar backgroundColor="indigo-950" text="99+" />
    </account-network-summary-assets>
</account-network-summary>

<style lang="postcss">
    account-network-summary-header {
        @apply px-5 py-4;
    }

    account-network-summary-balance {
        @apply p-5;
    }

    account-network-summary-assets {
        @apply px-5 py-4;
        @apply bg-purple-50;
    }

    .middle {
        border-top: 1px solid #f1eef9;
        border-bottom: 1px solid #f1eef9;
    }
</style>
