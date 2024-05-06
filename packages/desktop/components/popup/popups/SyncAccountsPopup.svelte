<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Alert, Table } from '@bloomwalletio/ui'
    import { sumBalanceForAccounts } from '@core/account'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { generateAndStoreActivitiesForAllAccounts } from '@core/activity/actions'
    import { localize } from '@core/i18n'
    import { loadNftsForActiveProfile } from '@core/nfts/actions'
    import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '@core/profile'
    import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
    import { checkActiveProfileAuth, getBaseToken, loadAccounts } from '@core/profile/actions'
    import { activeAccounts, activeProfile, getActiveProfileId, visibleActiveAccounts } from '@core/profile/stores'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { loadTokensForAllAccountBalances } from '@core/token/actions'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { onDestroy } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { SupportedStardustNetworkId } from '@core/network/constants'
    import { ledgerRaceConditionProtectionWrapper } from '@core/ledger'
    import { StardustNetworkId } from '@core/network/types'

    const { network, type } = $activeProfile

    const DEFAULT_CONFIG = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type]

    let accountStartIndex = 0
    let accountGapLimit = DEFAULT_CONFIG.initialAccountRange
    let previousAccountGapLimit = 0

    let addressStartIndex = 0
    const addressGapLimit = DEFAULT_CONFIG.addressGapLimit

    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    let previousAccountsLength = 0

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

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
    let depthSearch = false
    // Please don't modify this algorithm without consulting with the team
    async function multiAddressSearch(): Promise<void> {
        let recoverAccountsPayload: RecoverAccountsPayload

        if (
            !depthSearch &&
            breadthSearchCountSinceLastDepthSearch &&
            breadthSearchCountSinceLastDepthSearch % accountGapLimit === 0
        ) {
            // Depth search
            depthSearch = true
            recoverAccountsPayload = {
                accountStartIndex: accountGapLimit,
                accountGapLimit: 1,
                addressGapLimit: (searchCount - depthSearchCount) * addressGapLimit,
                syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex: 0 },
            }
            breadthSearchCountSinceLastDepthSearch = 0
            depthSearchCount++
            accountGapLimit++
        } else {
            // Breadth search
            depthSearch = false
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
            previousAccountGapLimit = accountGapLimit
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
    <div class="space-y-5">
        <Table
            items={[
                {
                    key: localize('popups.walletFinder.accountsSearched'),
                    value: previousAccountGapLimit.toString() || '-',
                },
                {
                    key: localize('popups.walletFinder.accountsFound'),
                    value: $activeAccounts.length.toString() || '0',
                },
                {
                    key: localize('popups.walletFinder.totalWalletBalance'),
                    value: formatTokenAmountBestMatch(totalBalance, getBaseToken()),
                },
            ]}
        />
        {#if hasUsedWalletFinder}
            <Alert variant="info" text={localize('popups.walletFinder.searchAgainHint')} />
        {/if}
    </div>
</PopupTemplate>
