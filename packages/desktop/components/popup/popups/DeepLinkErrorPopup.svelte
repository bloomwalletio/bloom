<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let error: Error
</script>

<PopupTemplate
    title={localize('popups.deeplinkError.title')}
    description={localize('popups.deeplinkError.body')}
    backButton={{
        text: localize('actions.close'),
        onClick: closePopup,
    }}
>
    <Alert variant="danger" text={error.message} />
</PopupTemplate>
