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
    import { onDestroy, onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { SupportedNetworkId } from '@core/network/enums'

    export let searchForBalancesOnLoad = false

    enum SearchMethod {
        SingleAddress = 'SingleAddress',
        MultiAddress = 'MultiAddress',
    }

    const { network, type } = $activeProfile

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

    async function searchForBalance(method: SearchMethod): Promise<void> {
        try {
            error = ''
            isBusy = true

            switch (method) {
                case SearchMethod.SingleAddress: {
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

                    break
                }
                case SearchMethod.MultiAddress:
                    // TODO: implement multi address search
                    break
            }

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
        await checkActiveProfileAuth(
            () =>
                searchForBalance(
                    network.id === SupportedNetworkId.Iota ? SearchMethod.MultiAddress : SearchMethod.SingleAddress
                ),
            {
                stronghold: true,
                ledger: true,
                props: { searchForBalancesOnLoad: true },
            }
        )
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(() => {
        searchForBalancesOnLoad &&
            void searchForBalance(
                network.id === SupportedNetworkId.Iota ? SearchMethod.MultiAddress : SearchMethod.SingleAddress
            )
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
