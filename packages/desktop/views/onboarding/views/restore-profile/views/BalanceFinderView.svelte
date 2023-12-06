<script lang="ts">
    import { Button, Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { onboardingProfile } from '@contexts/onboarding'
    import { IAccount } from '@core/account'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { ProfileType } from '@core/profile'
    import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
    import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '@core/profile/constants'
    import { checkOrUnlockStronghold } from '@core/stronghold/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { OnboardingLayout } from '@views/components'
    import { onDestroy, onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'

    const initialAccountRange = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[$onboardingProfile.type].initialAccountRange
    const addressGapLimitIncrement = DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION[$onboardingProfile.type].addressGapLimit
    let previousAccountGapLimit = 0
    let previousAddressGapLimit = 0
    let currentAccountGapLimit = initialAccountRange
    let currentAddressGapLimit = addressGapLimitIncrement
    let error = ''
    let isBusy = false

    async function onFindBalancesClick(): Promise<void> {
        await checkOnboardingProfileAuth(async () => await findBalances(SearchMethod.SingleAddress))
    }

    let accountsBalances: { alias: string; total: bigint }[] = []

    interface ISearch {
        accountStartIndex: number
        accountGapLimit: number
        accountEndIndex: number
        addressStartIndex: number
        addressGapLimit: number
        addressEndIndex: number
        searchSpace: number
        estimatedTime: number
        actualTime?: number
    }
    const searches: ISearch[] = []

    enum SearchMethod {
        SingleAddress = 'SingleAddress',
        Address = 'MultiAddress',
    }

    async function findBalances(method: SearchMethod): Promise<void> {
        if (method === SearchMethod.SingleAddress) {
            try {
                error = ''
                isBusy = true
                const recoverAccountsPayload: RecoverAccountsPayload = {
                    accountStartIndex: 0,
                    accountGapLimit: currentAccountGapLimit,
                    addressGapLimit: currentAddressGapLimit,
                    syncOptions: { ...DEFAULT_SYNC_OPTIONS, addressStartIndex: 0 },
                }
                const search: ISearch = {
                    accountStartIndex: recoverAccountsPayload.accountStartIndex,
                    accountGapLimit: recoverAccountsPayload.accountGapLimit,
                    accountEndIndex: recoverAccountsPayload.accountGapLimit,
                    addressStartIndex: recoverAccountsPayload.syncOptions.addressStartIndex,
                    addressGapLimit: recoverAccountsPayload.addressGapLimit,
                    addressEndIndex: recoverAccountsPayload.addressGapLimit,
                    searchSpace: recoverAccountsPayload.accountGapLimit * recoverAccountsPayload.addressGapLimit,
                    estimatedTime: 1 * recoverAccountsPayload.accountGapLimit * recoverAccountsPayload.addressGapLimit,
                }

                const startTime = new Date().getTime()
                const accounts = await recoverAccounts(recoverAccountsPayload)
                accountsBalances = await Promise.all(
                    accounts.map(async (account: IAccount) => {
                        return {
                            alias: await account.getMetadata().alias,
                            total: (await account.getBalance()).baseCoin.total,
                        }
                    })
                )
                const endTime = new Date().getTime()
                search.actualTime = endTime - startTime
                searches.push(search)

                previousAccountGapLimit = currentAccountGapLimit
                previousAddressGapLimit = currentAddressGapLimit
                currentAccountGapLimit += initialAccountRange
                currentAddressGapLimit += addressGapLimitIncrement
            } catch (err) {
                error = localize(err.error)
                console.error(error)
            } finally {
                isBusy = false
            }
        }
    }

    function onContinueClick(): void {
        $restoreProfileRouter.next()
    }

    function checkOnboardingProfileAuth(callback) {
        if ($onboardingProfile.type === ProfileType.Software) {
            return checkOrUnlockStronghold(callback)
        } else {
            return checkOrConnectLedger(callback)
        }
    }

    onMount(async () => {
        await checkOnboardingProfileAuth(async () => await findBalances(SearchMethod.SingleAddress))
    })

    onDestroy(() => {})
</script>

<OnboardingLayout
    title={localize('views.onboarding.shimmerClaiming.claimRewards.title')}
    description={localize('views.onboarding.shimmerClaiming.claimRewards.description')}
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
                <Tile border>
                    <div class="w-full flex flex-row justify-between items-center space-x-4">
                        <div class="flex flex-row items-center text-left space-x-2">
                            <Icon name={IconName.Wallet} />
                            <Text type="base">
                                {account?.alias}
                            </Text>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row justify-end items-center text-right space-x-2">
                                <Text type="base">
                                    {formatTokenAmountBestMatch(
                                        Number(account?.total),
                                        $onboardingProfile?.network?.baseToken
                                    )}
                                </Text>
                            </div>
                        </div>
                    </div>
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
