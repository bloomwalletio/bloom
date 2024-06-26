<script lang="ts">
    import { IconName, Menu, IMenuItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { disconnectDapp, removeDapp } from '@auxiliary/wallet-connect/actions'
    import { handleError } from '@core/error/handlers'

    export let drawerRouter: Router<unknown>
    export let dapp: IConnectedDapp

    const localeKey = 'views.dashboard.drawers.dapps.details'

    let menu: Menu | undefined = undefined

    $: menuItems = [
        ...(hasActiveSession
            ? [
                  {
                      icon: IconName.LinkBroken,
                      title: localize(`${localeKey}.actions.disconnect`),
                      variant: 'danger',
                      onClick: onDisconnectClick,
                  } as IMenuItem,
              ]
            : []),
        {
            icon: IconName.Trash,
            title: localize(`${localeKey}.actions.remove`),
            variant: 'danger',
            onClick: onRemoveClick,
        } as IMenuItem,
    ]

    $: dappName = dapp.metadata?.name ?? localize('general.unknown')
    $: hasActiveSession = !!dapp.sessionTopic

    function onRemoveClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize(`${localeKey}.remove.title`),
                description: localize(`${localeKey}.remove.description`, { dappName }),
                variant: 'danger',
                confirmText: localize(`${localeKey}.actions.remove`),
                onConfirm: async () => {
                    try {
                        await removeDapp(dapp)
                        showNotification({
                            variant: 'success',
                            text: localize('notifications.removeDapp.success', { dappName }),
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

    function onDisconnectClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize(`${localeKey}.disconnect.title`),
                description: localize(`${localeKey}.disconnect.description`, { dappName }),
                variant: 'danger',
                confirmText: localize(`${localeKey}.actions.disconnect`),
                onConfirm: async () => {
                    try {
                        await disconnectDapp(dapp)
                        showNotification({
                            variant: 'success',
                            text: localize('notifications.disconnectDapp.success', { dappName }),
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
