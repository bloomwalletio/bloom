<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { FAUCET_URLS, nodeInfo } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { ButtonTile } from '../../../components'

    function onGetTokensClick(): void {
        openPopup({
            id: PopupId.FaucetRequest,
        })
    }
</script>

{#if FAUCET_URLS?.[$activeProfile?.network?.id] && $nodeInfo}
    <ButtonTile
        primaryText={localize('actions.faucetRequest', {
            values: { token: $nodeInfo.baseToken.name },
        })}
        secondaryText={localize('general.faucetRequestDescription', {
            values: { network: $nodeInfo.protocol.networkName },
        })}
        onClick={onGetTokensClick}
        icon={IconName.CoinsHand}
    />
{/if}
