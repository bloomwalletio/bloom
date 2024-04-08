<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import {
        ClaimShimmerRewardsError,
        FindShimmerRewardsError,
        RestoreProfileType,
        ShimmerClaimingAccountState,
        canUserClaimRewards,
        canUserRecoverFromShimmerClaiming,
        claimShimmerRewards,
        createShimmerClaimingProfileManager,
        findShimmerRewards,
        hasUserClaimedRewards,
        initialiseAccountRecoveryConfigurationForShimmerClaiming,
        initialiseFirstShimmerClaimingAccount,
        isOnboardingLedgerProfile,
        onboardingProfile,
        shimmerClaimingProfileManager,
        subscribeToWalletApiEventsForShimmerClaiming,
        syncShimmerClaimingAccount,
    } from '@contexts/onboarding'
    import {
        copyStrongholdFileToProfileDirectory,
        getTemporaryProfileManagerStorageDirectory,
    } from '@contexts/onboarding/helpers'
    import { localize } from '@core/i18n'
    import {
        checkOrConnectLedger,
        checkOrConnectLedgerAsync,
        handleLedgerError,
        ledgerRaceConditionProtectionWrapper,
    } from '@core/ledger'
    import { unsubscribeFromWalletApiEvents } from '@core/profile-manager'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { ShimmerClaimingAccountList } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { onDestroy, onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'

    $: shimmerClaimingAccounts = $onboardingProfile?.shimmerClaimingAccounts ?? []

    let isSettingUp = false
    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false
    let hasTriedClaimingRewards = false

    $: isClaimingRewards = shimmerClaimingAccounts.some(
        (shimmerClaimingAccount) => shimmerClaimingAccount.state === ShimmerClaimingAccountState.Claiming
    )

    $: shouldSearchForRewardsButtonBeEnabled =
        !isSettingUp && !isSearchingForRewards && !isClaimingRewards && !hasUserClaimedRewards(shimmerClaimingAccounts)
    $: shouldClaimRewardsButtonBeEnabled =
        canUserClaimRewards(shimmerClaimingAccounts) && !isSettingUp && !isSearchingForRewards && !isClaimingRewards
    $: shouldShowContinueButton =
        hasUserClaimedRewards(shimmerClaimingAccounts) ||
        (hasSearchedForRewardsBefore && canUserRecoverFromShimmerClaiming(shimmerClaimingAccounts))

    function onContinueClick(): void {
        $restoreProfileRouter.next()
    }

    async function searchForRewards(): Promise<void> {
        try {
            isSearchingForRewards = true
            await findShimmerRewards()
            hasSearchedForRewardsBefore = true
        } catch (err) {
            if ($isOnboardingLedgerProfile) {
                handleLedgerError(err)
            } else {
                throw new FindShimmerRewardsError(err)
            }
        } finally {
            isSearchingForRewards = false
        }
    }

    async function onSearchForRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            void checkOrConnectLedger(() => ledgerRaceConditionProtectionWrapper(searchForRewards))
        } else {
            await ledgerRaceConditionProtectionWrapper(searchForRewards)
        }
    }

    async function claimRewards(): Promise<void> {
        try {
            hasTriedClaimingRewards = true
            await $shimmerClaimingProfileManager?.startBackgroundSync({ syncOnlyMostBasicOutputs: true })
            await claimShimmerRewards()
        } catch (err) {
            if ($isOnboardingLedgerProfile) {
                handleLedgerError(err)
            } else {
                throw new ClaimShimmerRewardsError(err)
            }
        } finally {
            if ($isOnboardingLedgerProfile) {
                closePopup({ forceClose: true })
            }
            hasTriedClaimingRewards = true
        }
    }

    async function onClaimRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            await checkOrConnectLedgerAsync()
        }
        await ledgerRaceConditionProtectionWrapper(claimRewards)
    }

    async function setupShimmerClaiming(): Promise<void> {
        initialiseAccountRecoveryConfigurationForShimmerClaiming()
        if (!$onboardingProfile?.shimmerClaimingAccounts || $onboardingProfile?.shimmerClaimingAccounts?.length < 1) {
            try {
                isSettingUp = true
                if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Stronghold) {
                    const shimmerClaimingProfileDirectory = await getTemporaryProfileManagerStorageDirectory()
                    await copyStrongholdFileToProfileDirectory(
                        shimmerClaimingProfileDirectory,
                        $onboardingProfile?.importFilePath ?? ''
                    )
                }

                await createShimmerClaimingProfileManager()

                subscribeToWalletApiEventsForShimmerClaiming()
                await $shimmerClaimingProfileManager?.startBackgroundSync({
                    syncOnlyMostBasicOutputs: true,
                    syncIncomingTransactions: true,
                })

                if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Mnemonic) {
                    await $shimmerClaimingProfileManager?.setStrongholdPassword($onboardingProfile.strongholdPassword)
                    await $shimmerClaimingProfileManager?.storeMnemonic($onboardingProfile.mnemonic.join(' '))
                } else if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Stronghold) {
                    await $shimmerClaimingProfileManager?.setStrongholdPassword($onboardingProfile.strongholdPassword)
                }

                await initialiseFirstShimmerClaimingAccount()
                await syncShimmerClaimingAccount($onboardingProfile?.shimmerClaimingAccounts?.[0])

                onSearchForRewardsClick()
            } catch (err) {
                if ($isOnboardingLedgerProfile) {
                    handleLedgerError(err)
                } else {
                    throw new FindShimmerRewardsError(err)
                }
            } finally {
                isSettingUp = false
            }
        }
    }

    onMount(() => {
        void ledgerRaceConditionProtectionWrapper(setupShimmerClaiming)
    })

    async function teardownShimmerClaiming(): Promise<void> {
        await unsubscribeFromWalletApiEvents(shimmerClaimingProfileManager)
        await $shimmerClaimingProfileManager?.stopBackgroundSync()
    }

    onDestroy(() => {
        void teardownShimmerClaiming()
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.restoreProfile.claimFinder.title')}
    description={localize('views.onboarding.restoreProfile.claimFinder.description')}
    continueButton={{
        text: localize(
            `actions.${
                shouldShowContinueButton ? 'continue' : hasTriedClaimingRewards ? 'rerunClaimProcess' : 'claimRewards'
            }`
        ),
        disabled: shouldShowContinueButton ? isSearchingForRewards : !shouldClaimRewardsButtonBeEnabled,
        onClick: shouldShowContinueButton ? onContinueClick : onClaimRewardsClick,
    }}
    backButton={undefined}
    busy={shouldShowContinueButton ? undefined : isClaimingRewards}
    busyText={shouldShowContinueButton ? '' : localize('actions.claiming')}
>
    <div slot="content" class="h-full flex flex-col gap-4">
        <ShimmerClaimingAccountList {shimmerClaimingAccounts} baseToken={$onboardingProfile?.network?.baseToken} />
        <Button
            on:click={onSearchForRewardsClick}
            width="full"
            disabled={!shouldSearchForRewardsButtonBeEnabled}
            variant="text"
            icon={IconName.Refresh}
            busy={isSettingUp || isSearchingForRewards}
            busyText={localize('actions.searching')}
            text={localize(`actions.${hasSearchedForRewardsBefore ? 'searchAgain' : 'useFinder'}`)}
        />
    </div>
</OnboardingLayout>
