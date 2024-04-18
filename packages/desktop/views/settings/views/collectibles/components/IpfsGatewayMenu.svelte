<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let url: string
    export let isPrimary: boolean = false

    let menu: Menu | undefined = undefined

    $: allowRemove = true

    function onTogglePrimaryClick(): void {
        // if (isPrimary) {
        //     openPopup({
        //         id: PopupId.Confirmation,
        //         props: {
        //             variant: 'danger',
        //             title: localize('popups.unsetAsPrimaryNode.title'),
        //             description: localize('popups.unsetAsPrimaryNode.body', { values: { url: node.url } }),
        //             confirmText: localize('actions.clear'),
        //             onConfirm: () => {
        //                 void togglePrimaryNodeInClientOptions(node)
        //                 closePopup()
        //             },
        //         },
        //     })
        // } else {
        //     await togglePrimaryNodeInClientOptions(node)
        // }
        menu?.close()
    }

    function onRemoveClick(): void {
        // openPopup({
        //     id: PopupId.Confirmation,
        //     props: {
        //         variant: 'danger',
        //         title: localize('popups.node.titleRemove'),
        //         description: localize('popups.node.removeConfirmation'),
        //         confirmText: localize('actions.removeNode'),
        //         onConfirm: () => {
        //             void removeNodeFromClientOptions(node)
        //             closePopup()
        //         },
        //     },
        // })
        menu?.close()
    }
</script>

<node-actions-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: isPrimary && url ? IconName.BookmarkX : IconName.BookmarkCheck,
                title: localize(
                    `views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.${
                        isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'
                    }`
                ),
                onClick: onTogglePrimaryClick,
            },
            {
                icon: IconName.Trash,
                title: localize('views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.removeNode'),
                variant: 'danger',
                disabled: !allowRemove,
                onClick: onRemoveClick,
            },
        ]}
    />
</node-actions-menu>
