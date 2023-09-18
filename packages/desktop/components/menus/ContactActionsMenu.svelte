<script lang="ts">
    import { Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '@views/dashboard/drawers'

    export let drawerRouter: Router<unknown>

    let menu: Menu | undefined = undefined

    function onEditContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.EditContact)
        menu?.close()
    }

    function onRemoveContactClick(): void {
        drawerRouter.goTo(ContactBookRoute.RemoveContact)
        menu?.close()
    }
</script>

<Menu
    bind:this={menu}
    items={[
        {
            text: localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.editContact`),
            onClick: onEditContactClick,
        },
        {
            text: localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.removeContact`),
            onClick: onRemoveContactClick,
            variant: 'danger',
        },
    ]}
/>
