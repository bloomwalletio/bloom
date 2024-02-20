<script lang="ts">
    import { AvatarGroup, Copyable, Text } from '@bloomwalletio/ui'
    import { FormattedBalance } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollL2BalanceForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import { NetworkHealth, NetworkId, network, setSelectedChain } from '@core/network'
    import { MimeType, Nft } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { IAccountTokensPerNetwork } from '@core/token'
    import { truncateString } from '@core/utils'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { NetworkAvatar, NetworkStatusIndicator, NftAvatar, TokenAvatar } from '@ui'
    import { DashboardDrawerRoute, NetworkConfigRoute } from '@views/dashboard/drawers'
    import { ProfileType } from 'shared/src/lib/core/profile'

    export let networkId: NetworkId
    export let name: string
    export let health: NetworkHealth
    export let address: string
    export let tokenBalance: string
    export let fiatBalance: string
    export let tokens: IAccountTokensPerNetwork
    export let nfts: Nft[]

    $: hasTokens = tokens?.nativeTokens?.length > 0
    $: hasNfts = nfts?.length > 0

    // sort nfts by image first then by if media is downloaded
    $: sortedNfts = sortNftsByLoadedImagesFirst(nfts)
    function sortNftsByLoadedImagesFirst(nfts: Nft[]): Nft[] {
        return nfts.sort((a, b) => {
            if (isImage(a) && !isImage(b)) {
                return -1
            }
            if (!isImage(a) && isImage(b)) {
                return 1
            }
            if (isImage(a) && isImage(b)) {
                if (a.isLoaded && !b.isLoaded) {
                    return -1
                }
                if (!a.isLoaded && b.isLoaded) {
                    return 1
                }
            }
            return 0
        })
    }

    function isImage(nft: Nft): boolean {
        return (
            nft.type === MimeType.ImageGif ||
            nft.type === MimeType.ImageJpeg ||
            nft.type === MimeType.ImagePng ||
            nft.type === MimeType.ImageWebp
        )
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
                pollL2BalanceForAccount($selectedAccount)
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
                <button type="button" class="generate-address-button" on:click={onGenerateAddressClick}>
                    {localize('actions.generateAddress')}
                </button>
            {/if}
        </account-network-summary-header-address>
    </account-network-summary-header>
    <account-network-summary-balance class="flex flex-col flex-grow justify-between items-start">
        <FormattedBalance balanceText={tokenBalance} textType="h3" />
        <Text type="body1" textColor="secondary">{fiatBalance}</Text>
    </account-network-summary-balance>
    <account-network-summary-assets class="flex flex-row justify-between items-center">
        <div>
            {#if hasTokens}
                {@const nativeTokens = tokens?.nativeTokens ?? []}
                <AvatarGroup avatarSize="md" remainder={nativeTokens.length - 4}>
                    {#each nativeTokens.slice(0, 4) ?? [] as token}
                        <TokenAvatar hideNetworkBadge size="md" {token} />
                    {/each}
                </AvatarGroup>
            {/if}
        </div>
        <div>
            {#if hasNfts}
                <AvatarGroup avatarSize="md" avatarShape="square" remainder={sortedNfts.length - 4}>
                    {#each sortedNfts.slice(0, 4) as nft}
                        <NftAvatar {nft} size="md" shape="square" />
                    {/each}
                </AvatarGroup>
            {/if}
        </div>
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
