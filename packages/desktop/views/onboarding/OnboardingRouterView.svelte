<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { OnboardingRoute } from './onboarding-route.enum'
    import { onboardingRoute } from './onboarding-router'
    import { ChooseOnboardingFlowView, CompleteOnboardingRouterView, WelcomeView } from './views'
    import { CreateProfileRouterView } from './views/create-profile'
    import { NetworkSetupRouterView } from './views/network-setup'
    import { RestoreProfileRouterView } from './views/restore-profile'

    $: if (features.analytics.onboardingRoute.enabled && $onboardingRoute) {
        Platform.trackEvent('onboarding-route', { route: $onboardingRoute })
    }
</script>

{#if $onboardingRoute === OnboardingRoute.Welcome}
    <WelcomeView />
{:else if $onboardingRoute === OnboardingRoute.NetworkSetup}
    <NetworkSetupRouterView />
{:else if $onboardingRoute === OnboardingRoute.ChooseOnboardingFlow}
    <ChooseOnboardingFlowView />
{:else if $onboardingRoute === OnboardingRoute.CreateProfile}
    <CreateProfileRouterView />
{:else if $onboardingRoute === OnboardingRoute.RestoreProfile}
    <RestoreProfileRouterView />
{:else if $onboardingRoute === OnboardingRoute.CompleteOnboarding}
    <CompleteOnboardingRouterView />
{/if}
