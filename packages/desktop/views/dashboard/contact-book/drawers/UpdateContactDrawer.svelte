<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '@components'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { ContactManager, selectedContact } from '@core/contacts'
    import { Button, TextInput } from '@ui'
    import { showAppNotification } from '@auxiliary/notification'

    export let drawerRouter: Router<unknown>

    let contactName = $selectedContact.name
    let contactNote = $selectedContact.note
    let contactErrors = {
        name: '',
        note: '',
    }

    $: contactName, contactNote, resetErrors()

    function resetErrors(): void {
        contactErrors = {
            name: '',
            note: '',
        }
    }

    function updateContact(): void {
        resetErrors()
        try {
            const contact = { ...$selectedContact, name: contactName, note: contactNote }
            ContactManager.validateContact(contact)
            ContactManager.updateContact($selectedContact.id, contact)
            showAppNotification({
                type: 'success',
                message: localize('notifications.updateContact.success'),
                alert: true,
            })

            drawerRouter.previous()
        } catch (error) {
            contactErrors.name = error.name
            contactErrors.note = error.note
        }
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.UpdateContact}.title`)}
    {drawerRouter}
>
    <div class="h-full flex flex-col justify-between">
        <div class="flex flex-col justify-between gap-4">
            <TextInput bind:value={contactName} placeholder={localize('general.name')} error={contactErrors.name} />
            <TextInput bind:value={contactNote} placeholder={localize('general.note')} error={contactErrors.note} />
        </div>
        <Button onClick={updateContact}>{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
