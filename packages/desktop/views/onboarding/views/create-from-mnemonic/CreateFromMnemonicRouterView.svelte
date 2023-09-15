<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { EncryptMnemonicView } from '../shared'
    import { CreateFromMnemonicRoute } from './create-from-mnemonic-route.enum'
    import { createFromMnemonicRoute, createFromMnemonicRouter } from './create-from-mnemonic-router'
    import { VerifyMnemonicView, ViewMnemonicView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $createFromMnemonicRoute) {
        Platform.trackEvent('create-from-mnemonic-route', { route: $createFromMnemonicRoute })
    }
</script>

{#if $createFromMnemonicRoute === CreateFromMnemonicRoute.ViewMnemonic}
    <ViewMnemonicView />
{:else if $createFromMnemonicRoute === CreateFromMnemonicRoute.VerifyMnemonic}
    <VerifyMnemonicView />
{:else if $createFromMnemonicRoute === CreateFromMnemonicRoute.EncryptMnemonic}
    <EncryptMnemonicView router={$createFromMnemonicRouter} />
{/if}
