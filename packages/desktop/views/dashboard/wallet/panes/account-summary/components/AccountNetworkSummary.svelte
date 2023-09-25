<script lang="ts">
    import { Avatar, Button, Copyable, Text } from '@bloomwalletio/ui'
    import { NetworkAvatar, NetworkStatusIndicator } from '@ui'
    import { truncateString } from '@core/utils'
    import { localize } from '@core/i18n'
    import { ownedNfts } from '@core/nfts/stores'
    import { selectedAccountTokens } from '@core/token/stores'
    import { NetworkHealth, NetworkId, network, setSelectedChain } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { generateAndStoreEvmAddressForAccounts } from '@core/layer-2/actions'
    import { activeProfile } from '@core/profile/stores'
    import { selectedAccount } from '@core/account/stores'
    import { LedgerAppName } from '@core/ledger'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { DashboardDrawerRoute, NetworkConfigRoute } from '@views/dashboard/drawers'
    import { ProfileType } from 'shared/src/lib/core/profile'
    import { IAccountTokensPerNetwork } from '@core/token'
    import { INft } from '@core/nfts'

    export let networkId: NetworkId
    export let name: string
    export let health: NetworkHealth
    export let address: string
    export let tokenBalance: string
    export let fiatBalance: string
    export let tokens: IAccountTokensPerNetwork
    export let nfts: INft[]

    $: $selectedAccountTokens, $ownedNfts, updateAssetCounts()

    let tokenCountFormatted: string
    let nftCountFormatted: string

    function updateAssetCounts(): void {
        const networkTokenList = [tokens?.baseCoin && tokens.baseCoin, ...(tokens?.nativeTokens ?? [])]
        tokenCountFormatted = getAvatarGroupCount(networkTokenList)
        nftCountFormatted = getAvatarGroupCount(nfts)
    }

    function getAvatarGroupCount(array: unknown[]): string {
        return array.length > 99 ? '99+' : array.length.toString()
    }

    function onGenerateAddressClick(): void {
        const chain = $network.getChain(networkId)
        if (!chain) {
            return
        }
        checkActiveProfileAuth(
            async () => {
                await generateAndStoreEvmAddressForAccounts(
                    $activeProfile.type,
                    chain.getConfiguration().coinType,
                    $selectedAccount
                )
                if ($activeProfile.type === ProfileType.Ledger) {
                    setSelectedChain(chain)
                    toggleDashboardDrawer({
                        id: DashboardDrawerRoute.NetworkConfig,
                        initialSubroute: NetworkConfigRoute.ConfirmLedgerEvmAddress,
                    })
                }
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
            <Text type="body1" truncate>{name}</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            {#if address}
                <NetworkStatusIndicator status={health} />
                <Copyable value={address}>
                    <Text type="pre-md" color="text-secondary" truncate>{truncateString(address)}</Text>
                </Copyable>
            {:else}
                <Button text={localize('actions.generateAddress')} variant="text" on:click={onGenerateAddressClick} />
            {/if}
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="middle flex flex-col justify-between items-start">
        <account-network-summary-balance-primary>
            <Text type="h3" truncate>{tokenBalance}</Text>
        </account-network-summary-balance-primary>
        <account-network-summary-balance-secondary>
            <Text type="body2" truncate>{fiatBalance}</Text>
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
