<script lang="ts">
    import { Avatar, Button, Copyable, Text } from '@bloomwalletio/ui'
    import { NetworkAvatar, NetworkStatusIndicator } from '@ui'
    import { truncateString } from '@core/utils'
    import { localize } from '@core/i18n'
    import { ownedNfts } from '@core/nfts/stores'
    import { selectedAccountTokens } from '@core/token/stores'
    import { IAccountNetworkSummaryProps } from '../interfaces'
    import { network, setSelectedChain } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { generateAndStoreEvmAddressForAccounts } from '@core/layer-2/actions'
    import { activeProfile } from '@core/profile/stores'
    import { selectedAccount } from '@core/account/stores'
    import { LedgerAppName } from '@core/ledger'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { DashboardDrawerRoute, NetworkConfigRoute } from '@views/dashboard/drawers'

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
        const chain = $network.getChain(networkId)
        if (!chain) {
            return
        }
        setSelectedChain(chain)
        checkActiveProfileAuth(
            async () => {
                toggleDashboardDrawer({
                    id: DashboardDrawerRoute.NetworkConfig,
                    initialSubRoute: NetworkConfigRoute.ConfirmLedgerEvmAddress,
                })
                await generateAndStoreEvmAddressForAccounts(
                    $activeProfile.type,
                    chain.getConfiguration().coinType,
                    $selectedAccount
                )
            },
            {},
            LedgerAppName.Ethereum
        )
    }
</script>

<account-network-summary class="w-full flex flex-col justify-between">
    <account-network-summary-header class="flex flex-row justify-between items-center gap-2">
        <div class="flex flex-row space-x-3 items-center">
            <NetworkAvatar {networkId} />
            <Text type="body1" truncate>{networkName}</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            {#if networkAddress}
                <NetworkStatusIndicator status={networkHealth} />
                <Copyable value={networkAddress}>
                    <Text type="pre-md" color="text-secondary" truncate>{truncateString(networkAddress)}</Text>
                </Copyable>
            {:else}
                <Button text={localize('actions.generateAddress')} variant="text" on:click={onGenerateAddressClick} />
            {/if}
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="middle flex flex-col justify-between items-start">
        <account-network-summary-balance-primary>
            <Text type="h3" truncate>{networkTokenBalance}</Text>
        </account-network-summary-balance-primary>
        <account-network-summary-balance-secondary>
            <Text type="body2" truncate>{networkFiatBalance}</Text>
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
