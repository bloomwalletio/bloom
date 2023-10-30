<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onErrorLogClick(): void {
        openPopup({ id: PopupId.ErrorLog }, false, false)
    }
</script>

<Text type="body2" class="mb-2">{localize('views.settings.errorLog.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.errorLog.description')}</Text>
<Button on:click={onErrorLogClick} text={localize('views.settings.errorLog.title')} />
