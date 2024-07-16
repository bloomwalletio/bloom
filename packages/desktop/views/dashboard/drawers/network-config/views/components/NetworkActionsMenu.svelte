<script lang="ts">
    import { IconName, Menu, IMenuItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { handleError } from '@core/error/handlers'
    import { EvmNetworkId, removeEvmNetwork } from '@core/network'

    export let drawerRouter: Router<unknown>
    export let networkId: EvmNetworkId
    export let networkName: string

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    let menu: Menu | undefined = undefined

    $: menuItems = [
        {
            icon: IconName.Trash,
            title: localize('actions.remove'),
            variant: 'danger',
            onClick: onRemoveClick,
        } as IMenuItem,
    ]

    function onRemoveClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize(`${localeKey}.remove.title`),
                description: localize(`${localeKey}.remove.description`, { networkName }),
                variant: 'danger',
                confirmText: localize('actions.remove'),
                onConfirm: () => {
                    try {
                        removeEvmNetwork(networkId)
                        showNotification({
                            variant: 'success',
                            text: localize('notifications.removeNetwork.success', { networkName }),
                        })
                        closePopup()
                        drawerRouter.previous()
                    } catch (error) {
                        handleError(error)
                    }
                },
            },
        })
    }
</script>

<Menu bind:this={menu} items={menuItems} />
