<script lang="ts">
    import { Platform, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { LoginRoute, loginRoute } from '@core/router'
    import features from '@features/features'
    import { UpdateStrongholdRouterView } from '@views'
    import { LoadProfileView, LoginView, SelectProfileView } from './views'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    $: if (features.analytics.loginRoute.enabled && $loginRoute)
        Platform.trackEvent('login-route', { route: $loginRoute })

    if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup(
            {
                id: PopupId.LegalUpdate,
                hideClose: true,
                preventClose: true,
            },
            false,
            false
        )
    }
</script>

{#if $loginRoute === LoginRoute.SelectProfile}
    <SelectProfileView />
{:else if $loginRoute === LoginRoute.EnterPin}
    <LoginView />
{:else if $loginRoute === LoginRoute.UpdateStronghold}
    <UpdateStrongholdRouterView />
{:else if $loginRoute === LoginRoute.LoadProfile}
    <LoadProfileView />
{/if}
