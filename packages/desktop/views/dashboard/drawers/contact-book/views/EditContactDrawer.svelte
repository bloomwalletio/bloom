<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { Button, TextInput } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { ContactManager, selectedContact, validateContactName, validateContactNote } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { showNotification } from '@auxiliary/notification'

    export let drawerRouter: Router<unknown>

    enum ContactField {
        Name = 'name',
        Note = 'note',
    }

    const validationErrors: { [key in ContactField]: string | undefined } = {
        [ContactField.Name]: undefined,
        [ContactField.Note]: undefined,
    }

    let nameInput, noteInput: TextInput
    let contactName = $selectedContact.name
    let contactNote = $selectedContact.note

    function onSaveClick(): void {
        try {
            if (validate()) {
                const contact = { ...$selectedContact, name: contactName, note: contactNote }
                ContactManager.updateContact($selectedContact.id, contact)
                showNotification({
                    variant: 'success',
                    text: localize('notifications.updateContact.success'),
                })
                drawerRouter.previous()
            }
        } catch (error) {
            showNotification({
                variant: 'error',
                text: error?.message ?? error,
            })
        }
    }

    function validate(): boolean {
        tryValidationFunction(() => validateContactName(contactName), ContactField.Name)
        tryValidationFunction(() => validateContactNote(contactNote), ContactField.Note)

        return !Object.values(validationErrors).some((error) => Boolean(error))
    }

    function tryValidationFunction(validationFunction: () => void, fieldName: ContactField): void {
        try {
            validationFunction()
        } catch (err) {
            if (fieldName in validationErrors) {
                validationErrors[fieldName] = err.message
            }
        }
    }

    function onCancelClick(): void {
        drawerRouter.previous()
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditContact}.title`)}
    {drawerRouter}
>
    <form on:submit|preventDefault={onSaveClick} id="edit-contact-form" class="flex flex-col justify-between gap-4">
        <TextInput
            bind:this={nameInput}
            bind:value={contactName}
            bind:error={validationErrors[ContactField.Name]}
            label={localize('general.name')}
        />
        <TextInput
            bind:this={noteInput}
            bind:value={contactNote}
            bind:error={validationErrors[ContactField.Note]}
            label={localize('general.optionalField', { field: localize('general.note') })}
        />
    </form>
    <div slot="footer" class="flex gap-4">
        <Button variant="outlined" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button
            type="submit"
            form="edit-contact-form"
            text={localize('actions.save')}
            width="half"
            on:click={onSaveClick}
        />
    </div>
</DrawerTemplate>
