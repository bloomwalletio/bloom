<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { IMenuItem, IconName, Menu } from '@bloomwalletio/ui'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { IEvmNetwork, NetworkType, removeExistingEvmNetwork } from '@core/network'
    import { Router } from '@core/router'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { Platform } from '@core/app'

    export let drawerRouter: Router<unknown>
    export let network: IEvmNetwork

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    $: menuItems = [
        ...(network.type === NetworkType.Evm && Platform.isFeatureFlagEnabled('network.config.removeNetwork')
            ? [
                  {
                      icon: IconName.Trash,
                      title: localize(`${localeKey}.remove.title`),
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
                alert: { variant: 'warning', text: localize(`${localeKey}.remove.alert`) },
                confirmText: localize('actions.remove'),
                onConfirm: () => {
                    try {
                        removeExistingEvmNetwork(network)
                        showNotification({
                            variant: 'success',
                            text: localize('notifications.removeNetwork.success', { networkName: network.name }),
                        })
                        closePopup()
                        if (drawerRouter.hasHistory()) {
                            drawerRouter.previous()
                        } else {
                            closeDrawer()
                        }
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
