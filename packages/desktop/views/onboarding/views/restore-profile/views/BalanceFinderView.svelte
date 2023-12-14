<script lang="ts">
    import { Button, Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { onboardingProfile } from '@contexts/onboarding'
    import { IAccount } from '@core/account'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { localize } from '@core/i18n'
    import { LedgerAppName, checkOrConnectLedger } from '@core/ledger'
    import { ProfileType } from '@core/profile'
    import { RecoverAccountsPayload, createAccount, recoverAccounts } from '@core/profile-manager'
    import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '@core/profile/constants'
    import { checkOrUnlockStronghold } from '@core/stronghold/actions'
    import { OnboardingLayout } from '@views/components'
    import { onDestroy, onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'
    import { SupportedNetworkId } from '@core/network'
    import { formatTokenAmountBestMatch } from '@core/token'

    interface IAccountBalance {
        alias: string
        total: string
    }

    enum SearchMethod {
        SingleAddress = 'SingleAddress',
        MultiAddress = 'MultiAddress',
    }

    const { network, type } = $onboardingProfile

    const initialAccountRange = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type].initialAccountRange
    const addressGapLimitIncrement = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[type].addressGapLimit

    let previousAccountGapLimit = 0
    let previousAddressGapLimit = 0
    let currentAccountGapLimit = initialAccountRange
    let currentAddressGapLimit = addressGapLimitIncrement

    let error = ''
    let isBusy = false

    let accountsBalances: IAccountBalance[] = []

    async function findBalances(method: SearchMethod): Promise<void> {
        try {
            error = ''
            isBusy = true

            switch (method) {
                case SearchMethod.SingleAddress: {
                    const recoverAccountsPayload: RecoverAccountsPayload = {
                        accountStartIndex: 0,
                        accountGapLimit: currentAccountGapLimit,
                        addressGapLimit: currentAddressGapLimit,
                        syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex: 0 },
                    }

                    accountsBalances = await recoverAndGetBalances(recoverAccountsPayload)

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
        } catch (err) {
            error = localize(err.error)
            console.error(error)
        } finally {
            isBusy = false
        }
    }

    async function recoverAndGetBalances(payload: RecoverAccountsPayload): Promise<IAccountBalance[]> {
        let accounts: IAccount[] = []
        accounts = [...accounts, ...(await recoverAccounts(payload))]

        if (accountsBalances.length === 0 && accounts.length === 0) {
            accounts = [await createAccount({ alias: `${localize('general.account')} 1` })]
        }

        return await Promise.all(accounts.map(getAccountBalanceFromAccount))
    }

    async function getAccountBalanceFromAccount(account: IAccount): Promise<IAccountBalance> {
        const alias = (await account.getMetadata())?.alias

        const balance = await account.getBalance()
        const baseToken = network.baseToken
        const baseCoinBalance = Number(balance?.baseCoin?.total) ?? 0
        const total = formatTokenAmountBestMatch(baseCoinBalance, baseToken)

        return { alias, total }
    }

    function checkOnboardingProfileAuth(callback) {
        if (type === ProfileType.Software) {
            return checkOrUnlockStronghold(callback)
        } else {
            return checkOrConnectLedger(
                callback,
                false,
                network.id === SupportedNetworkId.Iota ? LedgerAppName.Iota : LedgerAppName.Shimmer
            )
        }
    }

    function onContinueClick(): void {
        $restoreProfileRouter.next()
    }

    async function onFindBalancesClick(): Promise<void> {
        await checkOnboardingProfileAuth(
            async () =>
                await findBalances(
                    network.id === SupportedNetworkId.Iota ? SearchMethod.MultiAddress : SearchMethod.SingleAddress
                )
        )
    }

    onMount(async () => {
        await checkOnboardingProfileAuth(
            async () =>
                await findBalances(
                    network.id === SupportedNetworkId.Iota ? SearchMethod.MultiAddress : SearchMethod.SingleAddress
                )
        )
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
