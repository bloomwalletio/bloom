<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { disconnectDapp } from '@auxiliary/wallet-connect/actions/disconnectDapp'
    import { showNotification } from '@auxiliary/notification'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { handleError } from '@core/error/handlers'

    export let drawerRouter: Router<unknown>
    export let dapp: IConnectedDapp

    const localeKey = 'views.dashboard.drawers.dapps.details'

    let menu: Menu | undefined = undefined
    $: dappName = dapp.metadata?.name ?? localize(`${localeKey}.fallbackName`)

    function onDisconnectClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize(`${localeKey}.disconnectTitle`),
                description: localize(`${localeKey}.disconnectDescription`, { dappName }),
                variant: 'danger',
                confirmText: localize(`${localeKey}.actions.disconnect`),
                onConfirm: async () => {
                    try {
                        await disconnectDapp(dapp.topic)
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

<Menu
    bind:this={menu}
    items={[
        {
            icon: IconName.Trash,
            title: localize(`${localeKey}.actions.disconnect`),
            variant: 'danger',
            onClick: onDisconnectClick,
        },
    ]}
/>
