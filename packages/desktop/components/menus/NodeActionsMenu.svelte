<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { INode } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network/actions'
    import { IClientOptions, IStardustNetworkMetadata } from '@core/network/interfaces'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let currentNetwork: IStardustNetworkMetadata
    export let node: INode
    export let clientOptions: IClientOptions

    let menu: Menu | undefined = undefined

    $: allowDisableOrRemove = node?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1
    $: isPrimary = clientOptions?.primaryNode?.url === node.url

    function onEditNodeDetailsClick(): void {
        openPopup(
            {
                id: PopupId.AddNode,
                props: {
                    node,
                    isEditingNode: true,
                    currentNetwork,
                    onSuccess: () => {
                        closePopup()
                    },
                },
            },
            false,
            false
        )
        menu?.close()
    }

    async function onTogglePrimaryNodeClick(): Promise<void> {
        if (isPrimary) {
            openPopup(
                {
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
                },
                false,
                false
            )
        } else {
            await togglePrimaryNodeInClientOptions(node)
        }
        menu?.close()
    }

    function onRemoveNodeClick(): void {
        openPopup(
            {
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
            },
            false,
            false
        )
        menu?.close()
    }

    function onToggleDisabledNodeClick(): void {
        if (node.disabled) {
            void toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup(
                {
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
                },
                false,
                false
            )
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
                onClick: () => void onTogglePrimaryNodeClick(),
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
