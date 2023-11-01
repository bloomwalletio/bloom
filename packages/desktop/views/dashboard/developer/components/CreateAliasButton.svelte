<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { ButtonTile } from '../../../components'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    function onCreateAliasClick(): void {
        openPopup({
            id: PopupId.AliasConfirmation,
        })
    }
</script>

<ButtonTile
    primaryText={localize('actions.createAlias')}
    secondaryText={localize('actions.createAliasDescription')}
    onClick={onCreateAliasClick}
    icon={IconName.Alias}
/>
