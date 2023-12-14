<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '../../lib/auxiliary/popup'

    let menu: Menu | undefined = undefined

    function onImportErc721TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc721Token,
            overflow: true,
        })
        menu?.close()
    }
</script>

<collectibles-list-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: IconName.Import,
                title: localize('actions.importToken', { values: { type: 'ERC-721' } }),
                onClick: onImportErc721TokenClick,
            },
        ]}
    />
</collectibles-list-menu>
