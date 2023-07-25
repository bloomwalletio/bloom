<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, TextInput } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager, selectedContact, validateContactName, validateContactNote } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { showAppNotification } from '@auxiliary/notification'

    export let drawerRouter: Router<unknown>

    let nameInput, noteInput: TextInput
    let contactName = $selectedContact.name
    let contactNote = $selectedContact.note

    function updateContact(): void {
        try {
            if (validate()) {
                const contact = { ...$selectedContact, name: contactName, note: contactNote }
                ContactManager.updateContact($selectedContact.id, contact)
                showAppNotification({
                    type: 'success',
                    message: localize('notifications.updateContact.success'),
                    alert: true,
                })

                drawerRouter.previous()
            }
        } catch (error) {
            showAppNotification({
                type: 'error',
                alert: true,
                message: error?.message ?? error,
            })
        }
    }

    function validate(): boolean {
        /**
         * NOTE: This variable allows us to run all the input validation functions,
         * displaying all errors at once rather than one by one.
         */
        let handledError = false
        for (const input of [nameInput, noteInput]) {
            try {
                input.validate()
            } catch (err) {
                handledError = true
            }
        }
        return !handledError
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditContact}.title`)}
    {drawerRouter}
>
    <update-contact class="flex flex-col justify-between gap-4">
        <TextInput
            bind:this={nameInput}
            bind:value={contactName}
            placeholder={localize('general.name')}
            label={localize('general.name')}
            validationFunction={validateContactName}
        />
        <TextInput
            bind:this={noteInput}
            bind:value={contactNote}
            placeholder={localize('general.optionalField', { field: localize('general.note') })}
            label={localize('general.note')}
            validationFunction={validateContactNote}
        />
    </update-contact>
    <div slot="footer">
        <Button onClick={updateContact} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
