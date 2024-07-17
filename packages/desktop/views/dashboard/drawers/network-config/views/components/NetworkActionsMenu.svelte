<script lang="ts">
    import { IconName, Menu, IMenuItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { handleError } from '@core/error/handlers'
    import { IEvmNetwork, NetworkType, removeEvmNetwork } from '@core/network'

    export let drawerRouter: Router<unknown>
    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    $: menuItems = [
        ...(network.type === NetworkType.Evm
            ? [
                  {
                      icon: IconName.Trash,
                      title: localize('actions.remove'),
                      variant: 'danger',
                      onClick: onRemoveClick,
                  } as IMenuItem,
              ]
            : []),
    ]

    function onRemoveClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize(`${localeKey}.remove.title`),
                description: localize(`${localeKey}.remove.description`, { networkName: network.name }),
                variant: 'danger',
                confirmText: localize('actions.remove'),
                onConfirm: () => {
                    try {
                        removeEvmNetwork(network.id)
                        showNotification({
                            variant: 'success',
                            text: localize('notifications.removeNetwork.success', { networkName: network.name }),
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

{#if menuItems.length}
    <Menu items={menuItems} />
{/if}
