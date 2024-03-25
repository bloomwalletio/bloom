<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '../../lib/auxiliary/popup'

    let menu: Menu | undefined = undefined

    function onExportActivitiesClick(): void {
        openPopup({
            id: PopupId.ExportActivities,
        })
        menu?.close()
    }
</script>

<activity-list-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: IconName.Download,
                title: localize('actions.export'),
                onClick: onExportActivitiesClick,
            },
        ]}
    />
</activity-list-menu>
