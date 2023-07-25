<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { onboardingProfile } from '@contexts/onboarding'
    import { IAccount } from '@core/account'
    import { DEFAULT_SYNC_OPTIONS } from '@core/account/constants'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { ProfileType } from '@core/profile'
    import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
    import { DEFAULT_ACCOUNT_RECOVERY_CONFIGURATION } from '@core/profile/constants'
    import { checkOrUnlockStronghold } from '@core/stronghold/actions'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { Animation, Button, FontWeight, Icon, Text, TextType, Tile } from '@ui'
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
        await checkOnboardingProfileAuth(findBalances)
    }

    let accountsBalances: { alias: string; total: string }[] = []

    async function findBalances(): Promise<void> {
        try {
            error = ''
            isBusy = true
            const recoverAccountsPayload: RecoverAccountsPayload = {
                accountStartIndex: 0,
                accountGapLimit: currentAccountGapLimit,
                addressGapLimit: currentAddressGapLimit,
                syncOptions: DEFAULT_SYNC_OPTIONS,
            }

            const accounts = await recoverAccounts(recoverAccountsPayload)
            accountsBalances = await Promise.all(
                accounts.map(async (account: IAccount) => {
                    return {
                        alias: await account.getMetadata().alias,
                        total: (await account.getBalance()).baseCoin.total,
                    }
                })
            )

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
        await checkOnboardingProfileAuth(findBalances)
    })

    onDestroy(() => {})
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type="h2">
            {localize('views.onboarding.shimmerClaiming.claimRewards.title')}
        </Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col">
        <Text type="p" secondary classes="mb-5">
            {localize('views.onboarding.shimmerClaiming.claimRewards.body')}
        </Text>
        <div class="flex-auto overflow-y-auto h-1 space-y-3 w-full scrollable-y">
            {#each accountsBalances as account}
                <Tile isGhost classes="rounded-xl">
                    <div class="w-full flex flex-row justify-between items-center space-x-4">
                        <div class="flex flex-row items-center text-left space-x-2">
                            <Icon icon="wallet" width={28} height={28} classes="text-blue-500" />
                            <Text type={TextType.p} fontWeight={FontWeight.medium}>
                                {account?.alias}
                            </Text>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-row justify-end items-center text-right space-x-2">
                                <Text type={TextType.p} fontWeight={FontWeight.semibold}>
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
    </div>
    <div slot="leftpane__action">
        <Button
            classes="w-full mb-5"
            disabled={isBusy}
            outline
            onClick={onFindBalancesClick}
            {isBusy}
            busyMessage={localize('actions.searching')}
        >
            {localize('actions.searchAgain')}
        </Button>
        <Button classes="w-full" disabled={isBusy} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
