<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
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
            icon: IconName.Edit,
            title: localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.editContact`),
            onClick: onEditContactClick,
        },
        {
            icon: IconName.Trash,
            title: localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.ContactInformation}.removeContact`),
            variant: 'danger',
            onClick: onRemoveContactClick,
        },
    ]}
/>
