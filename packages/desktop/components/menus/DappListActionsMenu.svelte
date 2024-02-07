<script lang="ts">
    import { IconName, Menu, IMenuItem } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { showNotification } from '@auxiliary/notification'
    import { handleError } from '@core/error/handlers'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.dappsList'

    let menu: Menu | undefined = undefined

    $: menuItems = [
        {
            icon: IconName.Trash,
            title: localize(`${localeKey}.actions.clearExpired`),
            variant: 'danger',
            onClick: onDisconnectClick,
        } as IMenuItem,
    ]

    function onDisconnectClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize(`${localeKey}.clearExpired.title`),
                description: localize(`${localeKey}.clearExpired.description`),
                variant: 'danger',
                onConfirm: () => {
                    try {
                        showNotification({
                            variant: 'success',
                            text: localize('notifications.disconnectDapp.success'),
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
