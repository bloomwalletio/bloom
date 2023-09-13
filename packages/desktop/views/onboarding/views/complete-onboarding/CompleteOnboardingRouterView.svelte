<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { CompleteOnboardingRoute } from './complete-onboarding-route.enum'
    import { completeOnboardingRoute } from './complete-onboarding-router'
    import EnterNameView from './views/EnterNameView.svelte'
    import EnterPinView from './views/EnterPinView.svelte'
    import FinishOnboardingView from './views/FinishOnboardingView.svelte'

    $: if (features.analytics.onboardingRoute.enabled && $completeOnboardingRoute) {
        Platform.trackEvent('complete-onboarding-route', { route: $completeOnboardingRoute })
    }
</script>

{#if $completeOnboardingRoute === CompleteOnboardingRoute.EnterName}
    <EnterNameView />
{:else if $completeOnboardingRoute === CompleteOnboardingRoute.EnterPin}
    <EnterPinView />
{:else if $completeOnboardingRoute === CompleteOnboardingRoute.FinishOnboarding}
    <FinishOnboardingView />
{/if}
