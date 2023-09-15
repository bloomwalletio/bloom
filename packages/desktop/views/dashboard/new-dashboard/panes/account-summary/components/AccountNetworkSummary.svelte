<script lang="ts">
    import { Avatar, Copyable, Text } from '@bloomwalletio/ui'
    import { NetworkAvatar, NetworkStatusIndicator } from '@ui'
    import { truncateString } from '@core/utils'
    import { IAccountNetworkSummaryProps } from '../interfaces'

    export let props: IAccountNetworkSummaryProps

    const {
        networkId,
        networkName,
        networkHealth,
        networkAddress,
        networkTokenBalance,
        networkFiatBalance,
        networkTokens,
    } = props ?? <IAccountNetworkSummaryProps>{}

    function getTokenCount(): string {
        const networkTokenList = [networkTokens.baseCoin, ...networkTokens.nativeTokens]
        return networkTokenList.length > 99 ? '99+' : networkTokenList.length.toString()
    }
</script>

<account-network-summary class="w-full flex flex-col justify-between">
    <account-network-summary-header class="flex flex-row justify-between items-center">
        <div class="flex flex-row space-x-3 items-center">
            <NetworkAvatar {networkId} />
            <Text type="h6" align="center" truncate>{networkName}</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            <NetworkStatusIndicator status={networkHealth} />
            <Copyable value={networkAddress}>
                <Text type="pre" align="center" truncate>{truncateString(networkAddress)}</Text>
            </Copyable>
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="middle flex flex-col justify-between items-start">
        <account-network-summary-balance-primary>
            <Text type="p" weight="semibold" size="3xl" align="center" truncate>{networkTokenBalance}</Text>
        </account-network-summary-balance-primary>
        <account-network-summary-balance-secondary>
            <Text type="p" weight="semibold" align="center" truncate>{networkFiatBalance}</Text>
        </account-network-summary-balance-secondary>
    </account-network-summary-balance>
    <account-network-summary-assets class="flex flex-row justify-between items-center">
        <Avatar backgroundColor="indigo-950" shape="square" text="8" />
        <Avatar backgroundColor="indigo-950" text={getTokenCount()} />
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
