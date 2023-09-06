<script lang="ts">
    import { Alert, Button } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { ContactManager, doesProfileHaveContacts, selectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { Router } from '@core/router'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { Text } from '@ui'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    function onCancelClick(): void {
        drawerRouter.previous()
    }

    function onRemoveClick(): void {
        ContactManager.deleteContact($selectedContact.id)
        if (doesProfileHaveContacts($activeProfile)) {
            drawerRouter.goTo(ContactBookRoute.ContactList)
        } else {
            closeDrawer()
        }
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveContact}.title`)}
    {drawerRouter}
>
    <remove-contact class="flex flex-col gap-4">
        <Text>
            {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveContact}.body`)}
        </Text>
        <Alert
            variant="warning"
            text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveContact}.hint`)}
        />
    </remove-contact>
    <div slot="footer" class="flex gap-4">
        <Button variant="outline" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button color="red" text={localize('actions.remove')} width="half" on:click={onRemoveClick} />
    </div>
</DrawerTemplate>
