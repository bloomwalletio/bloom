<script lang="ts">
    import { Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '../../lib/auxiliary/popup'

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
            text: localize('general.importErc20Token'),
            onClick: onImportErc20TokenClick,
        },
    ]}
/>
