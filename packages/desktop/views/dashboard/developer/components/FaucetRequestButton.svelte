<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { FAUCET_URLS, getL1Network } from '@core/network'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { ButtonTile } from '../../../components'

    const network = getL1Network()

    function onGetTokensClick(): void {
        openPopup({
            id: PopupId.FaucetRequest,
        })
    }
</script>

{#if network && FAUCET_URLS?.[network?.id]}
    <ButtonTile
        primaryText={localize('actions.faucetRequest', {
            values: { token: network.baseToken.name },
        })}
        secondaryText={localize('general.faucetRequestDescription', {
            values: { network: network.name },
        })}
        onClick={onGetTokensClick}
        icon={IconName.CoinsHand}
    />
{/if}
