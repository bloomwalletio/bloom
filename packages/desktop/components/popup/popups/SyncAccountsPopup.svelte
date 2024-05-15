<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Alert, Indicator, Text, Toggle } from '@bloomwalletio/ui'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { selectedAccountIndex } from '@core/account/stores'
    import { generateAndStoreActivitiesForAllAccounts } from '@core/activity/actions'
    import { localize } from '@core/i18n'
    import { ledgerRaceConditionProtectionWrapper } from '@core/ledger'
    import { SupportedStardustNetworkId } from '@core/network/constants'
    import { StardustNetworkId } from '@core/network/types'
    import { loadNftsForActiveProfile } from '@core/nfts/actions'
    import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '@core/profile'
    import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
    import { checkActiveProfileAuth, loadAccounts } from '@core/profile/actions'
    import { activeAccounts, activeProfile, getActiveProfileId, visibleActiveAccounts } from '@core/profile/stores'
    import { formatTokenAmount } from '@core/token'
    import { loadTokensForAllAccountBalances } from '@core/token/actions'
    import { allAccountTokens } from '@core/token/stores'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { onDestroy } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    const { network, type } = $activeProfile

    const DEFAULT_CONFIG = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type]

    let accountStartIndex = 0
    let accountGapLimit = Math.max(DEFAULT_CONFIG.initialAccountRange, $activeAccounts.length)

    let addressStartIndex = 0
    const addressGapLimit = DEFAULT_CONFIG.addressGapLimit

    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    let previousAccountsLength = 0

    const networkSearchMethod: { [key in StardustNetworkId]?: () => Promise<void> } = {
        [SupportedStardustNetworkId.Iota]: multiAddressSearch,
        [SupportedStardustNetworkId.Shimmer]: singleAddressSearch,
        [SupportedStardustNetworkId.Testnet]: singleAddressSearch,
    }

    async function singleAddressSearch(): Promise<void> {
        const recoverAccountsPayload: RecoverAccountsPayload = {
            accountStartIndex,
            accountGapLimit,
            addressGapLimit: 1,
            syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex: 0 },
        }

        await recoverAccounts(recoverAccountsPayload)

        const numberOfAccountsFound = Math.max(0, $visibleActiveAccounts.length - previousAccountsLength)
        accountStartIndex = accountStartIndex + accountGapLimit + numberOfAccountsFound
    }

    let searchCount = 0
    let depthSearchCount = 0
    let breadthSearchCountSinceLastDepthSearch = 0
    let isDepthSearch = false
    let isSingleAccountSearch = false
    // Please don't modify this algorithm without consulting with the team
    async function multiAddressSearch(): Promise<void> {
        let recoverAccountsPayload: RecoverAccountsPayload

        if (
            isSingleAccountSearch ||
            (!isDepthSearch &&
                breadthSearchCountSinceLastDepthSearch &&
                breadthSearchCountSinceLastDepthSearch % accountGapLimit === 0)
        ) {
            // Depth search
            isDepthSearch = true
            recoverAccountsPayload = {
                accountStartIndex: isSingleAccountSearch ? $selectedAccountIndex : accountGapLimit,
                accountGapLimit: isSingleAccountSearch ? 0 : 1,
                addressGapLimit: isSingleAccountSearch
                    ? addressGapLimit
                    : (searchCount - depthSearchCount) * addressGapLimit,
                syncOptions: {
                    ...DEFAULT_SYNC_OPTIONS,
                    addressStartIndex: isSingleAccountSearch ? addressStartIndex : 0,
                },
            }
            breadthSearchCountSinceLastDepthSearch = 0
            depthSearchCount++
            if (isSingleAccountSearch) {
                addressStartIndex += addressGapLimit
            } else {
                accountGapLimit++
            }
        } else {
            // Breadth search
            isDepthSearch = false
            recoverAccountsPayload = {
                accountStartIndex,
                accountGapLimit,
                addressGapLimit: addressGapLimit,
                syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex },
            }
            breadthSearchCountSinceLastDepthSearch++
            addressStartIndex += addressGapLimit
        }

        await recoverAccounts(recoverAccountsPayload)

        searchCount++
    }

    async function onFindBalancesClick(): Promise<void> {
        try {
            await checkActiveProfileAuth()
        } catch {
            return
        }

        try {
            error = ''
            isBusy = true
            const _function = networkSearchMethod[network?.id] ?? singleAddressSearch
            await ledgerRaceConditionProtectionWrapper(_function)
            await loadAccounts()
            previousAccountsLength = $visibleActiveAccounts.length
            hasUsedWalletFinder = true
        } catch (err) {
            error = localize(err.error)
            showNotification({
                variant: 'error',
                text: error,
            })
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    onDestroy(async () => {
        if (hasUsedWalletFinder) {
            const profileId = getActiveProfileId()
            await loadTokensForAllAccountBalances()
            await generateAndStoreActivitiesForAllAccounts(profileId)
            loadNftsForActiveProfile()
        }
    })
</script>

<PopupTemplate
    title={localize('popups.walletFinder.title')}
    description={localize('popups.walletFinder.body')}
    busy={isBusy}
    backButton={{
        text: localize('actions.back'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: hasUsedWalletFinder ? localize('actions.searchAgain') : localize('actions.search'),
        onClick: onFindBalancesClick,
    }}
>
    <div class="flex flex-col overflow-hidden gap-5">
        {#if network?.id === SupportedStardustNetworkId.Iota}
            <div class="flex gap-2">
                <Toggle
                    label={localize('popups.walletFinder.singleAccountSearch')}
                    bind:checked={isSingleAccountSearch}
                />
                <Text>{localize('popups.walletFinder.singleAccountSearch')}</Text>
            </div>
        {/if}
        <account-balance-list class="overflow-y-scroll h-0 flex-1 flex flex-col">
            {#each $activeAccounts as account}
                {@const baseCoin = $allAccountTokens[account.index]?.[network.id]?.baseCoin}
                <div class="w-full flex flex-row items-center justify-between items-center justify-between p-4 gap-3">
                    <div class="flex flex-row items-center gap-3">
                        <Indicator color={account.color} />
                        <Text>{account.name}</Text>
                    </div>
                    <Text>{formatTokenAmount(baseCoin?.balance?.total, baseCoin?.metadata)}</Text>
                </div>
            {/each}
        </account-balance-list>
        {#if hasUsedWalletFinder}
            <Alert variant="info" text={localize('popups.walletFinder.searchAgainHint')} />
        {/if}
    </div>
</PopupTemplate>

<style lang="postcss">
    account-balance-list {
        @apply bg-surface-0 dark:bg-surface-0-dark;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply rounded-xl;
    }
</style>
