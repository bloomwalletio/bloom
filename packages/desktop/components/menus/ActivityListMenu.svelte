<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'

    let menu: Menu | undefined = undefined

    function onExportActivitiesClick(): void {
        openPopup({
            id: PopupId.ExportActivities,
        })
        menu?.close()
    }

    const items = [
        ...(features.wallet.activityHistory.exportCsv.enabled
            ? [
                  {
                      icon: IconName.Download,
                      title: localize('actions.exportActivities'),
                      onClick: onExportActivitiesClick,
                  },
              ]
            : []),
    ]
</script>

{#if items.length}
    <activity-list-menu>
        <Menu bind:this={menu} {items} />
    </activity-list-menu>
{/if}
