<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '../../lib/auxiliary/popup'

    let menu: Menu | undefined = undefined

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
        menu?.close()
    }
</script>

<Menu
    bind:this={menu}
    items={[
        {
            icon: IconName.Import,
            text: localize('general.importErc20Token'),
            onClick: onImportErc20TokenClick,
        },
    ]}
/>
