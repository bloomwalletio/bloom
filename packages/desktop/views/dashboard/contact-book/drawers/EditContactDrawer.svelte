<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, TextInput } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager, selectedContact } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

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
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditContact}.title`)}
    {drawerRouter}
>
    <update-contact class="flex flex-col justify-between gap-4">
        <TextInput
            bind:value={contactName}
            placeholder={localize('general.name')}
            label={localize('general.name')}
            error={contactErrors.name}
        />
        <TextInput
            bind:value={contactNote}
            placeholder={localize('general.note')}
            label={localize('general.note')}
            error={contactErrors.note}
        />
    </update-contact>
    <div slot="footer">
        <Button onClick={updateContact} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
