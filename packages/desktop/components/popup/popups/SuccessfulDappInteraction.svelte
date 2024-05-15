<script lang="ts">
    import { SuccessSvg } from '@views/onboarding/components'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { Alert, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import { DappInfo } from '@ui'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'

    export let dapp: IConnectedDapp | undefined
    export let successMessage: string
</script>

<PopupTemplate
    backButton={{
        text: localize('actions.close'),
        onClick: closePopup,
    }}
>
    <DappInfo
        slot="banner"
        metadata={dapp?.metadata}
        showLink={false}
        classes="bg-surface-1 dark:bg-surface-1-dark pb-4"
    />
    <div slot="description">
        <div class="flex flex-col items-center justify-between gap-3">
            <SuccessSvg />
            <Text type="h5" textColor="success" align="center">{successMessage}</Text>
        </div>
    </div>
    <Alert text={localize('popups.successfulDappInteraction.alert')} />
</PopupTemplate>
