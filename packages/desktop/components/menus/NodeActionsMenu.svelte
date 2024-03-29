<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { INode } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network/actions'
    import { IClientOptions } from '@core/network/interfaces'
    import { getDefaultNodes } from '@core/network/utils'
    import { activeProfile } from '@core/profile/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let node: INode
    export let clientOptions: IClientOptions

    let menu: Menu | undefined = undefined

    $: isOfficialNode = getDefaultNodes($activeProfile?.network?.id).some((n) => n.url === node?.url)
    $: allowDisableOrRemove = node?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1
    $: isPrimary = clientOptions?.primaryNode?.url === node.url

    function onEditNodeDetailsClick(): void {
        openPopup({
            id: PopupId.AddNode,
            props: {
                node,
                isEditingNode: true,
                onSuccess: () => {
                    closePopup()
                },
            },
        })
        menu?.close()
    }

    async function onTogglePrimaryNodeClick(): Promise<void> {
        if (isPrimary) {
            openPopup({
                id: PopupId.Confirmation,
                props: {
                    variant: 'danger',
                    title: localize('popups.unsetAsPrimaryNode.title'),
                    description: localize('popups.unsetAsPrimaryNode.body', { values: { url: node.url } }),
                    confirmText: localize('actions.clear'),
                    onConfirm: () => {
                        void togglePrimaryNodeInClientOptions(node)
                        closePopup()
                    },
                },
            })
        } else {
            await togglePrimaryNodeInClientOptions(node)
        }
        menu?.close()
    }

    function onRemoveNodeClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                variant: 'danger',
                title: localize('popups.node.titleRemove'),
                description: localize('popups.node.removeConfirmation'),
                confirmText: localize('actions.removeNode'),
                onConfirm: () => {
                    void removeNodeFromClientOptions(node)
                    closePopup()
                },
            },
        })
        menu?.close()
    }

    function onToggleDisabledNodeClick(): void {
        if (node.disabled) {
            void toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup({
                id: PopupId.Confirmation,
                props: {
                    variant: 'danger',
                    title: localize('popups.excludeNode.title'),
                    description: localize('popups.excludeNode.body', { values: { url: node?.url } }),
                    confirmText: localize(
                        'views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.excludeNode'
                    ),
                    onConfirm: () => {
                        void toggleDisabledNodeInClientOptions(node)
                        closePopup()
                    },
                },
            })
        }
        menu?.close()
    }
</script>

<node-actions-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: IconName.Edit,
                title: localize('views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.editDetails'),
                disabled: isOfficialNode,
                onClick: onEditNodeDetailsClick,
            },
            {
                icon: isPrimary ? IconName.BookmarkX : IconName.BookmarkCheck,
                title: localize(
                    `views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.${
                        isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'
                    }`
                ),
                disabled: node?.disabled,
                onClick: onTogglePrimaryNodeClick,
            },
            {
                icon: node.disabled ? IconName.PlayCircle : IconName.PauseCircle,
                title: localize(
                    `views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.${
                        node.disabled ? 'include' : 'exclude'
                    }Node`
                ),
                disabled: !allowDisableOrRemove,
                onClick: onToggleDisabledNodeClick,
            },
            {
                icon: IconName.Trash,
                title: localize('views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.removeNode'),
                variant: 'danger',
                disabled: !allowDisableOrRemove,
                onClick: onRemoveNodeClick,
            },
        ]}
    />
</node-actions-menu>
