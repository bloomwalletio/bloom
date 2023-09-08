<script lang="ts">
    import { localize } from '@core/i18n'
    import { FAUCET_URLS, nodeInfo } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { OnboardingButton } from '@ui'

    function onGetTokensClick(): void {
        openPopup({
            id: PopupId.FaucetRequest,
        })
    }
</script>

{#if FAUCET_URLS?.[$activeProfile?.network?.id] && $nodeInfo}
    <OnboardingButton
        primaryText={localize('actions.faucetRequest', {
            values: { token: $nodeInfo.baseToken.name },
        })}
        secondaryText={localize('general.faucetRequestDescription', {
            values: { network: $nodeInfo.protocol.networkName },
        })}
        onClick={onGetTokensClick}
    />
{/if}
