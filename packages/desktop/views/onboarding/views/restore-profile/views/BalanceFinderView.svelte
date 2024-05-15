<script lang="ts">
    import { Button, Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { onboardingProfile } from '@contexts/onboarding'
    import { IAccount } from '@core/account'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { localize } from '@core/i18n'
    import { LedgerAppName, checkOrConnectLedger, ledgerRaceConditionProtectionWrapper } from '@core/ledger'
    import { SupportedStardustNetworkId } from '@core/network/constants'
    import { NetworkId } from '@core/network/types'
    import { ProfileType } from '@core/profile'
    import { RecoverAccountsPayload, createAccount, recoverAccounts } from '@core/profile-manager'
    import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '@core/profile/constants'
    import { formatTokenAmount } from '@core/token'
    import { OnboardingLayout } from '@views/components'
    import { onDestroy, onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'

    interface IAccountBalance {
        alias: string
        total: string
    }

    const { network, type } = $onboardingProfile ?? {}

    const DEFAULT_CONFIG = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type as ProfileType]

    let accountStartIndex = 0
    let accountGapLimit = DEFAULT_CONFIG.initialAccountRange

    let addressStartIndex = 0
    const addressGapLimit = DEFAULT_CONFIG.addressGapLimit

    let error = ''
    let isBusy = false

    let accountsBalances: IAccountBalance[] = []

    const networkSearchMethod: { [key in NetworkId]?: () => Promise<void> } = {
        [SupportedStardustNetworkId.Iota]: multiAddressSearch,
        [SupportedStardustNetworkId.Shimmer]: singleAddressSearch,
        [SupportedStardustNetworkId.Testnet]: singleAddressSearch,
    }

    async function singleAddressSearch(): Promise<void> {
        const recoverAccountsPayload: RecoverAccountsPayload = {
            accountStartIndex,
            accountGapLimit,
            addressGapLimit: 0,
            syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex: 0 },
        }

        accountsBalances = await recoverAndGetBalances(recoverAccountsPayload)
        const numberOfAccountsFound = Math.max(0, accountsBalances.length - accountStartIndex)

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

        accountsBalances = await recoverAndGetBalances(recoverAccountsPayload)

        searchCount++
    }

    async function findBalances(): Promise<void> {
        try {
            error = ''
            isBusy = true
            const _function = networkSearchMethod[network?.id] ?? singleAddressSearch
            await ledgerRaceConditionProtectionWrapper(_function)
        } catch (err) {
            error = localize(err.error)
            console.error(error)
        } finally {
            isBusy = false
        }
    }

    async function recoverAndGetBalances(payload: RecoverAccountsPayload): Promise<IAccountBalance[]> {
        const accounts = await recoverAccounts(payload)
        return await Promise.all(accounts.map(getAccountBalanceFromAccount))
    }

    async function getAccountBalanceFromAccount(account: IAccount): Promise<IAccountBalance> {
        const alias = account.getMetadata()?.alias

        const balance = await account.getBalance()
        const baseToken = network?.baseToken
        const baseCoinBalance = balance?.baseCoin?.total ?? BigInt(0)
        const total = formatTokenAmount(baseCoinBalance, baseToken)

        return { alias, total }
    }

    function onContinueClick(): void {
        $restoreProfileRouter.next()
    }

    async function onFindBalancesClick(): Promise<void> {
        if (type === ProfileType.Ledger) {
            await checkOrConnectLedger(
                network?.id === SupportedStardustNetworkId.Iota ? LedgerAppName.Iota : LedgerAppName.Shimmer
            )
        }
        await findBalances()
    }

    onMount(async () => {
        await onFindBalancesClick()
        if (accountsBalances.length === 0) {
            const account = await createAccount({ alias: `${localize('general.account')} 1` })
            accountsBalances = [await getAccountBalanceFromAccount(account)]
        }
    })

    onDestroy(() => {})
</script>

<OnboardingLayout
    title={localize('views.onboarding.restoreProfile.balanceFinder.title')}
    description={localize('views.onboarding.restoreProfile.balanceFinder.description')}
    continueButton={{
        text: localize('actions.continue'),
        disabled: isBusy,
        onClick: onContinueClick,
    }}
    backButton={undefined}
    busy={isBusy}
>
    <div slot="content" class="h-full flex flex-col gap-4">
        <div class="flex-auto overflow-y-auto max-h-64 space-y-3 w-full scrollable-y">
            {#each accountsBalances as account}
                {@const alias = account?.alias.toLowerCase().includes(localize('general.account').toLowerCase())
                    ? account?.alias
                    : `${localize('general.account')} ${account?.alias}`}
                <Tile border>
                    <container class="w-full flex flex-row justify-between items-center gap-4">
                        <div class="flex flex-row items-center text-left gap-3.5">
                            <Icon name={IconName.Wallet} textColor="brand" />
                            <Text type="body1">
                                {alias}
                            </Text>
                        </div>
                        <div class="flex flex-col justify-end items-end">
                            <Text type="body1" align="right" textColor="secondary">
                                {account?.total}
                            </Text>
                        </div>
                    </container>
                </Tile>
            {/each}
        </div>
        <Button
            on:click={onFindBalancesClick}
            width="full"
            variant="text"
            icon={IconName.Refresh}
            busy={isBusy}
            busyText={localize('actions.searching')}
            text={localize('actions.search')}
        />
    </div>
</OnboardingLayout>
