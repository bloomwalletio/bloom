<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { setSelectedContactNetworkId } from '@core/contact'
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '@views/dashboard/drawers'

    export let drawerRouter: Router<unknown>
    export let networkId: NetworkId

    let menu: Menu | undefined = undefined

    function onEditNetworkAddressesClick(): void {
        setSelectedContactNetworkId(networkId)
        drawerRouter.goTo(ContactBookRoute.EditNetworkAddresses)
        menu?.close()
    }

    function onRemoveNetworkClick(): void {
        setSelectedContactNetworkId(networkId)
        drawerRouter.goTo(ContactBookRoute.RemoveNetworkAddresses)
        menu?.close()
    }
</script>

<Menu
    bind:this={menu}
    items={[
        {
            icon: IconName.Edit,
            title: localize('actions.edit'),
            onClick: onEditNetworkAddressesClick,
        },
        {
            icon: IconName.Trash,
            title: localize('actions.delete'),
            variant: 'danger',
            onClick: onRemoveNetworkClick,
        },
    ]}
/>
