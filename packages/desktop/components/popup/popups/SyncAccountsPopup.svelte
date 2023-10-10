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
    import { activeAccounts, activeProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { refreshAccountTokensForActiveProfile } from '@core/token/actions'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Text, TextType } from '@ui'
    import { onDestroy, onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let searchForBalancesOnLoad = false

    const { type } = $activeProfile

    const initialAccountRange = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type].initialAccountRange
    const addressGapLimitIncrement = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type].addressGapLimit
    let previousAccountGapLimit = 0
    let previousAddressGapLimit = 0
    let currentAccountGapLimit = initialAccountRange
    let currentAddressGapLimit = addressGapLimitIncrement
    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    async function searchForBalance(): Promise<void> {
        try {
            error = ''
            isBusy = true
            const recoverAccountsPayload: RecoverAccountsPayload = {
                accountStartIndex: 0,
                accountGapLimit: currentAccountGapLimit,
                addressGapLimit: currentAddressGapLimit,
                syncOptions: DEFAULT_SYNC_OPTIONS,
            }
            await recoverAccounts(recoverAccountsPayload)
            await loadAccounts()
            previousAccountGapLimit = currentAccountGapLimit
            previousAddressGapLimit = currentAddressGapLimit
            currentAccountGapLimit += initialAccountRange
            currentAddressGapLimit += addressGapLimitIncrement
            hasUsedWalletFinder = true
        } catch (err) {
            error = localize(err.error)
            showNotification({
                variant: 'error',
                text: localize(err.error),
            })
        } finally {
            isBusy = false
        }
    }

    async function onFindBalancesClick(): Promise<void> {
        await checkActiveProfileAuth(searchForBalance, {
            stronghold: true,
            ledger: true,
            props: { searchForBalancesOnLoad: true },
        })
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(() => {
        searchForBalancesOnLoad && void searchForBalance()
    })

    onDestroy(async () => {
        if (hasUsedWalletFinder) {
            await refreshAccountTokensForActiveProfile()
            await generateAndStoreActivitiesForAllAccounts()
            loadNftsForActiveProfile()
        }
    })
</script>

<PopupTemplate
    title={localize('popups.walletFinder.title')}
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
        <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">
            {localize('popups.walletFinder.body')}
        </Text>
        <div class="w-full flex-col space-y-2">
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
        </div>

        {#if hasUsedWalletFinder}
            <Alert variant="info" text={localize('popups.walletFinder.searchAgainHint')} />
        {/if}
    </div>
</PopupTemplate>
