<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { ButtonTile } from '../../../components'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onClick(): void {
        openPopup({
            id: PopupId.TestDeepLinkForm,
        })
    }
</script>

<ButtonTile
    primaryText={localize('actions.testDeepLink')}
    secondaryText={localize('general.testDeepLinkDescription')}
    {onClick}
    icon={IconName.DeepLink}
/>
