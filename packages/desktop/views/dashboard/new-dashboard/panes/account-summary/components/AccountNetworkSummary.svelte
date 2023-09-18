<script lang="ts">
    import { Avatar, Button, Copyable, Text } from '@bloomwalletio/ui'
    import { NetworkAvatar, NetworkStatusIndicator } from '@ui'
    import { truncateString } from '@core/utils'
    import { localize } from '@core/i18n'
    import { ownedNfts } from '@core/nfts/stores'
    import { selectedAccountTokens } from '@core/token/stores'
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
        networkNfts,
    } = props ?? <IAccountNetworkSummaryProps>{}

    $: $selectedAccountTokens, $ownedNfts, updateAssetCounts()

    let tokenCountFormatted: string
    let nftCountFormatted: string

    function updateAssetCounts(): void {
        const networkTokenList = [
            networkTokens?.baseCoin && networkTokens.baseCoin,
            ...(networkTokens?.nativeTokens ?? []),
        ]
        tokenCountFormatted = getAvatarGroupCount(networkTokenList)
        nftCountFormatted = getAvatarGroupCount(networkNfts)
    }

    function getAvatarGroupCount(array: unknown[]): string {
        return array.length > 99 ? '99+' : array.length.toString()
    }

    function onGenerateAddressClick(): void {
        /* eslint-disable no-console */
        console.log('generate address')
    }
</script>

<account-network-summary class="w-full flex flex-col justify-between">
    <account-network-summary-header class="flex flex-row justify-between items-center gap-2">
        <div class="flex flex-row space-x-3 items-center">
            <NetworkAvatar {networkId} />
            <Text type="h6" align="center" color="indigo-950" truncate>{networkName}</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            {#if networkAddress}
                <NetworkStatusIndicator status={networkHealth} />
                <Copyable value={networkAddress}>
                    <Text type="pre" align="center" color="indigo-950" truncate>{truncateString(networkAddress)}</Text>
                </Copyable>
            {:else}
                <Button text={localize('actions.generateAddress')} variant="text" on:click={onGenerateAddressClick} />
            {/if}
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="middle flex flex-col justify-between items-start">
        <account-network-summary-balance-primary>
            <Text type="p" weight="semibold" size="3xl" color="indigo-950" align="center" truncate
                >{networkTokenBalance}</Text
            >
        </account-network-summary-balance-primary>
        <account-network-summary-balance-secondary>
            <Text type="p" weight="semibold" align="center" truncate>{networkFiatBalance}</Text>
        </account-network-summary-balance-secondary>
    </account-network-summary-balance>
    <account-network-summary-assets class="flex flex-row justify-between items-center">
        <Avatar backgroundColor="indigo-950" shape="square" text={nftCountFormatted} />
        <Avatar backgroundColor="indigo-950" text={tokenCountFormatted} />
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
