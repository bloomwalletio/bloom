<script lang="ts">
    import { SuccessSvg } from '@views/onboarding/components'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { Alert, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import { getConnectedDappByOrigin } from '@auxiliary/wallet-connect/stores'

    export let url: string | undefined

    const dapp = getConnectedDappByOrigin(url)

    const closeButton = {
        text: localize('actions.close'),
        onClick: closePopup,
    }
</script>

<PopupTemplate backButton={closeButton}>
    <div class="flex flex-col items-center justify-between">
        <SuccessSvg />
    </div>
    <Text align="center" type="h5" textColor="success">{dapp?.metadata?.name} {localize('general.connected')}</Text>
    <Alert text={localize('popups.successfulDappConnection.alert')} />
</PopupTemplate>
