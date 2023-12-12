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
</script>

<PopupTemplate
    backButton={{
        text: localize('actions.close'),
        onClick: closePopup,
    }}
>
    <DappDataBanner slot="banner" {dapp} />
    <div slot="description">
        <div class="flex flex-col items-center justify-between gap-3">
            <SuccessSvg />
            <Text type="h5" textColor="success">{localize('general.success')}</Text>
        </div>
    </div>
    <Alert text={localize('popups.successfulDappInteraction.alert')} />
</PopupTemplate>
