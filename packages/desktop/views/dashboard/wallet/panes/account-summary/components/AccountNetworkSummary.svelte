<script lang="ts">
    import { AvatarGroup, Copyable, Text } from '@bloomwalletio/ui'
    import { FormattedBalance } from '@components'
    import { NftAvatar, TokenAvatar } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollLayer2Tokens } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import { NetworkHealth, NetworkId, network, setSelectedChain } from '@core/network'
    import { INft } from '@core/nfts'
    import { ownedNfts } from '@core/nfts/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { IAccountTokensPerNetwork } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { truncateString } from '@core/utils'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { NetworkAvatar, NetworkStatusIndicator } from '@ui'
    import { DashboardDrawerRoute, NetworkConfigRoute } from '@views/dashboard/drawers'
    import { ProfileType } from 'shared/src/lib/core/profile'

    export let networkId: NetworkId
    export let name: string
    export let health: NetworkHealth
    export let address: string
    export let tokenBalance: string
    export let fiatBalance: string
    export let tokens: IAccountTokensPerNetwork
    export let nfts: INft[]

    $: $selectedAccountTokens, $ownedNfts, updateAssetCounts()

    $: hasTokens = tokens?.nativeTokens?.length > 0
    $: hasNfts = nfts?.length > 0

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
                pollLayer2Tokens($selectedAccount)
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

<account-network-summary class="h-full w-full flex flex-col justify-between">
    <account-network-summary-header class="flex flex-row justify-between items-center gap-2">
        <div class="flex flex-row space-x-3 items-center">
            <NetworkAvatar {networkId} />
            <Text type="body2" lineClamp={1} class="text-ellipse overflow-hidden">{name}</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            {#if address}
                <NetworkStatusIndicator status={health} />
                <Copyable value={address}>
                    <Text type="pre-md" textColor="secondary" truncate>{truncateString(address)}</Text>
                </Copyable>
            {:else}
                <p class="generate-address-button" on:click={onGenerateAddressClick}>
                    {localize('actions.generateAddress')}
                </p>
            {/if}
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="flex flex-col flex-grow justify-between items-start">
        <FormattedBalance balanceText={tokenBalance} textType="h3" />
        <Text type="body1" textColor="secondary">{fiatBalance}</Text>
    </account-network-summary-balance>
    <account-network-summary-assets class="flex flex-row justify-between items-center">
        {#if hasTokens}
            <AvatarGroup avatarSize="md">
                {#each tokens?.nativeTokens ?? [] as token}
                    <TokenAvatar hideNetworkBadge size="md" {token} />
                {/each}
            </AvatarGroup>
        {/if}
        {#if hasNfts}
            <AvatarGroup avatarSize="md" avatarShape="square">
                {#each nfts as nft}
                    <NftAvatar {nft} size="md" shape="square" />
                {/each}
            </AvatarGroup>
        {/if}
    </account-network-summary-assets>
</account-network-summary>

<style lang="postcss">
    account-network-summary {
        @apply bg-surface dark:bg-surface-dark;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
    }

    account-network-summary-header {
        height: 56px;
        @apply px-5 py-4;
    }

    account-network-summary-balance {
        @apply p-5;
    }

    account-network-summary-assets {
        height: 64px;
        @apply px-5 py-4;
        @apply bg-surface-1 dark:bg-surface-1-dark;
    }

    .generate-address-button {
        @apply text-[0.8125rem] font-semibold;
        @apply text-primary-500 hover:text-primary-600 focus:text-primary-600;
        @apply whitespace-nowrap;
        @apply hover:cursor-pointer;
    }
</style>
