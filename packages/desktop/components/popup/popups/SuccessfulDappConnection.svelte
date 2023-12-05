<script lang="ts">
    import { SuccessSvg } from '@views/onboarding/components'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { Alert, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import { getConnectedDappByOrigin } from '@auxiliary/wallet-connect/stores'
    import DappDataBanner from '@components/DappDataBanner.svelte'

    export let url: string | undefined

    const dapp = getConnectedDappByOrigin(url)

    const closeButton = {
        text: localize('actions.close'),
        onClick: closePopup,
    }
</script>

<PopupTemplate backButton={closeButton}>
    <DappDataBanner slot="banner" {dapp} />
    <div slot="description">
        <div class="flex flex-col items-center justify-between gap-3">
            <SuccessSvg />
            <Text type="h5" textColor="success">{dapp?.metadata?.name} {localize('general.connected')}</Text>
        </div>
    </div>
    <Alert text={localize('popups.successfulDappConnection.alert')} />
</PopupTemplate>
