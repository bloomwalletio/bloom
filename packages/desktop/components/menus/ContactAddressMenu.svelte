<script lang="ts">
    import { Menu } from '@bloomwalletio/ui'
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
            text: localize('actions.edit'),
            onClick: onEditNetworkAddressesClick,
        },
        {
            text: localize('actions.delete'),
            onClick: onRemoveNetworkClick,
            variant: 'danger',
        },
    ]}
/>
