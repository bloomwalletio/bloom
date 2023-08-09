<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { sumBalanceForAccounts } from '@core/account'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { generateAndStoreActivitiesForAllAccounts } from '@core/activity/actions'
    import { localize } from '@core/i18n'
    import { loadNftsForActiveProfile } from '@core/nfts'
    import {
        DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION,
        activeAccounts,
        activeProfile,
        checkActiveProfileAuth,
        getBaseToken,
        loadAccounts,
        visibleActiveAccounts,
    } from '@core/profile'
    import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
    import { formatTokenAmountBestMatch, refreshAccountTokensForActiveProfile } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Button, FontWeight, KeyValueBox, Text, TextHint, TextType } from '@ui'
    import { onDestroy, onMount } from 'svelte'

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

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6"
    >{localize('popups.walletFinder.title')}</Text
>

<div class="space-y-4">
    <Text type={TextType.p} color="gray-600" fontSize="15" lineHeight="5">{localize('popups.walletFinder.body')}</Text>

    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsSearched')}
            valueText={previousAccountGapLimit.toString() || '-'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsFound')}
            valueText={$activeAccounts.length.toString() || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.totalWalletBalance')}
            valueText={formatTokenAmountBestMatch(totalBalance, getBaseToken())}
        />
    </div>

    {#if hasUsedWalletFinder}
        <TextHint info icon="exclamation" text={localize('popups.walletFinder.searchAgainHint')} />
    {/if}
</div>

<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" outline onClick={onCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button
        classes="w-full"
        onClick={onFindBalancesClick}
        disabled={isBusy}
        {isBusy}
        busyMessage={localize('actions.searching')}
    >
        {#if hasUsedWalletFinder}
            {localize('actions.searchAgain')}
        {:else}
            {localize('actions.search')}
        {/if}
    </Button>
</div>
