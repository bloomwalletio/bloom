<script lang="ts">
    import { Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import {
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
        togglePrimaryNodeInClientOptions,
    } from '@core/network/actions'
    import { IClientOptions, INode } from '@core/network/interfaces'
    import { getDefaultNodes } from '@core/network/utils'
    import { activeProfile } from '@core/profile/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let node: INode
    export let clientOptions: IClientOptions

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
    }

    async function onTogglePrimaryNodeClick(): Promise<void> {
        if (isPrimary) {
            openPopup({
                id: PopupId.Confirmation,
                props: {
                    title: localize('popups.unsetAsPrimaryNode.title'),
                    description: localize('popups.unsetAsPrimaryNode.body', { values: { url: node.url } }),
                    danger: true,
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
    }

    function onRemoveNodeClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.node.titleRemove'),
                description: localize('popups.node.removeConfirmation'),
                danger: true,
                confirmText: localize('actions.removeNode'),
                onConfirm: () => {
                    void removeNodeFromClientOptions(node)
                    closePopup()
                },
            },
        })
    }

    function onToggleDisabledNodeClick(): void {
        if (node.disabled) {
            void toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup({
                id: PopupId.Confirmation,
                props: {
                    title: localize('popups.excludeNode.title'),
                    description: localize('popups.excludeNode.body', { values: { url: node?.url } }),
                    danger: true,
                    confirmText: localize('views.settings.configureNodeList.excludeNode'),
                    onConfirm: () => {
                        void toggleDisabledNodeInClientOptions(node)
                        closePopup()
                    },
                },
            })
        }
    }
</script>

<Menu
    items={[
        {
            text: localize('views.settings.configureNodeList.editDetails'),
            onClick: onEditNodeDetailsClick,
            disabled: isOfficialNode,
        },
        {
            text: localize(`views.settings.configureNodeList.${isPrimary ? 'unsetAsPrimary' : 'setAsPrimary'}`),
            onClick: onTogglePrimaryNodeClick,
            disabled: node?.disabled,
        },
        {
            text: localize(`views.settings.configureNodeList.${node.disabled ? 'include' : 'exclude'}Node`),
            onClick: onToggleDisabledNodeClick,
            disabled: !allowDisableOrRemove,
        },
        {
            text: localize('views.settings.configureNodeList.removeNode'),
            onClick: onRemoveNodeClick,
            variant: 'danger',
            disabled: !allowDisableOrRemove,
        },
    ]}
/>
