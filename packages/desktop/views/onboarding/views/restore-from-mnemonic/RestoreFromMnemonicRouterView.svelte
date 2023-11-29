<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { EncryptMnemonicView } from '../shared'
    import { RestoreFromMnemonicRoute } from './restore-from-mnemonic-route.enum'
    import { restoreFromMnemonicRoute, restoreFromMnemonicRouter } from './restore-from-mnemonic-router'
    import { InputMnemonicView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $restoreFromMnemonicRoute) {
        Platform.trackEvent('restore-from-mnemonic-route', { route: $restoreFromMnemonicRoute })
    }
</script>

{#if $restoreFromMnemonicRoute === RestoreFromMnemonicRoute.InputMnemonic}
    <InputMnemonicView />
{:else if $restoreFromMnemonicRoute === RestoreFromMnemonicRoute.EncryptMnemonic}
    <EncryptMnemonicView router={$restoreFromMnemonicRouter} />
{/if}
