<script lang="typescript">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '../../lib/auxiliary/popup'

    let menu: Menu | undefined

    function onRevoteClick(): void {
        openPopup({
            id: PopupId.Revote,
        })
        menu?.close()
    }
</script>

<Menu
    bind:this={menu}
    items={[
        {
            icon: IconName.Redo,
            title: localize('actions.revote'),
            onClick: onRevoteClick,
        },
    ]}
/>
