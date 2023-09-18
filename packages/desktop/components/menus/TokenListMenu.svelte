<script lang="ts">
    import { Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '../../lib/auxiliary/popup'

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
    }
</script>

<Menu
    items={[
        {
            text: localize('general.importErc20Token'),
            onClick: onImportErc20TokenClick,
        },
    ]}
/>
