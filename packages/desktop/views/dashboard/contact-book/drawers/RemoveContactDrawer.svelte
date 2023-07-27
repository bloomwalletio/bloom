<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, ButtonVariant, Text, TextHint } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager, doesProfileHaveContacts, selectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { activeProfile } from '@core/profile'
    import { closeDrawer } from '@desktop/auxiliary/drawer'

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
        <TextHint
            icon="exclamation"
            warning
            text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveContact}.hint`)}
        />
    </remove-contact>
    <div slot="footer" class="flex gap-4">
        <Button outline onClick={onCancelClick} classes="flex-1">
            {localize('actions.cancel')}
        </Button>
        <Button variant={ButtonVariant.Warning} onClick={onRemoveClick} classes="flex-1">
            {localize('actions.remove')}
        </Button>
    </div>
</DrawerTemplate>
