<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { initialiseOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
    import { AppContext, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { localize } from '@core/i18n'
    import { removeProfileFolder } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import { loadPersistedProfileIntoActiveProfile } from '@core/profile/actions'
    import { profiles } from '@core/profile/stores'
    import { loginRouter, routerManager } from '@core/router'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { Logo, Profile } from '@ui'
    import { OnboardingRouter, onboardingRouter } from '@views/onboarding'
    import { onMount } from 'svelte'

    function onContinueClick(profileId: string): void {
        loadPersistedProfileIntoActiveProfile(profileId)
        $loginRouter.next()
    }

    async function onAddProfileClick(): Promise<void> {
        onboardingRouter.set(new OnboardingRouter())
        await initialiseOnboardingProfile()
        $routerManager.goToAppContext(AppContext.Onboarding)
    }

    $: if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            id: PopupId.LegalUpdate,
            hideClose: true,
            preventClose: true,
        })
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view from onboarding
        if ($onboardingProfile) {
            if ($onboardingProfile.hasInitialisedProfileManager) {
                await destroyProfileManager()
                await removeProfileFolder($onboardingProfile.id)
            }
            $onboardingProfile = undefined
        }
    })
</script>

<section class="flex flex-col justify-between items-center h-full bg-slate-100 dark:bg-gray-900 p-12 pb-8">
    <logo-container class="block w-full">
        <Logo width="150" logo="logo-bloom-full" />
    </logo-container>
    <div class="profiles-wrapper h-auto items-start justify-center w-full overlay-scrollbar flex flex-row flex-wrap">
        {#each $profiles as profile}
            <div class="mx-7 mb-8">
                <Profile {profile} onClick={onContinueClick} />
            </div>
        {/each}
    </div>
    <footer class="flex flex-col w-full relative">
        <hr class="border-white dark:border-gray-800 mb-8" />
        <Button
            on:click={onAddProfileClick}
            variant="text"
            icon={IconName.Plus}
            text={localize('general.addProfile')}
        />
    </footer>
</section>

<style lang="postcss">
    footer:after {
        content: '';
        @apply absolute h-full w-1/2 bg-violet-700 blur-3xl opacity-50 left-1/2 -bottom-20 -translate-x-1/2;
    }
</style>
