<script lang="ts">
    import { AvatarGroup, Copyable, Text } from '@bloomwalletio/ui'
    import { FormattedBalance } from '@components'
    import { formatCurrency, localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollEvmBalancesForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import { Network, NetworkNamespace, setSelectedNetworkForNetworkDrawer } from '@core/network'
    import { MimeType, Nft } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { DashboardRoute, dashboardRouter } from '@core/router'
    import { formatTokenAmount } from '@core/token'
    import { truncateString } from '@core/utils'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { NetworkAvatar, NetworkStatusIndicator, NftAvatar, TokenAvatar } from '@ui'
    import { DashboardDrawerRoute, NetworkConfigRoute } from '@views/dashboard/drawers'
    import { ProfileType } from 'shared/src/lib/core/profile'
    import features from '@features/features'
    import { handleError } from '@core/error/handlers'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccountTokens } from '@core/token/stores'
    import { ownedNfts } from '@core/nfts/stores'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'

    export let network: Network
    export let account: IAccountState

    $: health = network.health
    $: tokens = $selectedAccountTokens?.[network.id]
    $: nfts = $ownedNfts.filter((nft) => nft.networkId === network.id && !(nft.hidden || nft.isScam))
    $: tokenBalance = formatTokenAmount(tokens?.baseCoin?.balance.total ?? BigInt(0), tokens?.baseCoin?.metadata)
    $: fiatBalance = tokens
        ? formatCurrency(getFiatValueFromTokenAmount(BigInt(tokens?.baseCoin?.balance.total ?? 0), tokens.baseCoin))
        : ''
    $: address = getAddressFromAccountForNetwork(account, network.id)

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

    function onNftGroupClick(): void {
        $dashboardRouter?.reset()
        $dashboardRouter?.goTo(DashboardRoute.Collectibles)
    }

    async function onGenerateAddressClick(): Promise<void> {
        if (network.namespace !== NetworkNamespace.Evm) {
            return
        }

        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch (error) {
            return
        }

        try {
            await generateAndStoreEvmAddressForAccounts($activeProfile.type, network.coinType, account)
            if (account.index === 0 && $activeProfile.type === ProfileType.Software) {
                try {
                    await notificationsManager.registerAccount(account, network.id, network.coinType)
                } catch (error) {
                    console.error(error)
                }
            }
            pollEvmBalancesForAccount($activeProfile.id, account)
            if ($activeProfile.type === ProfileType.Ledger) {
                setSelectedNetworkForNetworkDrawer(network)
                toggleDashboardDrawer({
                    id: DashboardDrawerRoute.NetworkConfig,
                    initialSubroute: NetworkConfigRoute.ConfirmLedgerEvmAddress,
                })
            }
        } catch (error) {
            handleError(error)
        }
    }
</script>

<account-network-summary class="h-full w-full flex flex-col justify-between">
    <account-network-summary-header class="flex flex-row justify-between items-center gap-2">
        <div class="flex flex-row space-x-3 items-center">
            <NetworkAvatar networkId={network.id} />
            <Text type="body2" lineClamp={1} class="text-ellipse overflow-hidden">{network.name}</Text>
        </div>
        <account-network-summary-header-address class="flex flex-row items-center space-x-2">
            {#if address}
                <NetworkStatusIndicator status={$health} />
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
                <button
                    on:click={() => onNftGroupClick()}
                    disabled={!features?.collectibles?.enabled || !$activeProfile?.features?.collectibles}
                >
                    <AvatarGroup avatarSize="md" avatarShape="square" remainder={sortedNfts.length - 4}>
                        {#each sortedNfts.slice(0, 4) as nft}
                            <NftAvatar {nft} size="md" shape="square" />
                        {/each}
                    </AvatarGroup>
                </button>
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
