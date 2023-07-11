<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, NetworkInput, TextInput, HR } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager, validateContactName } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    export let drawerRouter: Router<unknown>

    let name: string = ''
    let nameInput: TextInput
    let nameError: string = ''
    let note: string = ''
    let noteError: string = ''
    let address: string = ''
    let addressError: string = ''
    let addressName: string = ''
    let addressNameError: string = ''
    let networkSelection: { networkId: string; address?: string } | undefined
    let networkSelectionError: string = ''

    function onSaveClick(): void {
        const contact = { name, note }
        const networkAddress = { networkId: networkSelection?.networkId, addressName, address }

        if (validate()) {
            ContactManager.addContact(contact, networkAddress)
            drawerRouter.previous()
        }
    }

    function validate(): boolean {
        try {
            nameInput.validate()
            return true
        } catch (err) {
            return false
        }
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddContact}.title`)}
    {drawerRouter}
>
    <add-contact class="flex flex-col gap-4">
        <TextInput
            bind:this={nameInput}
            bind:value={name}
            bind:error={nameError}
            placeholder={localize('general.name')}
            label={localize('general.name')}
            validationFunction={validateContactName}
        />
        <TextInput
            bind:value={note}
            bind:error={noteError}
            placeholder={localize('general.note')}
            label={localize('general.note')}
        />
        <HR />
        <NetworkInput bind:networkSelection bind:error={networkSelectionError} showLayer2={true} />
        <TextInput
            bind:value={addressName}
            bind:error={addressNameError}
            placeholder={localize('general.addressName')}
            label={localize('general.addressName')}
        />
        <TextInput
            bind:value={address}
            bind:error={addressError}
            placeholder={localize('general.address')}
            label={localize('general.address')}
        />
    </add-contact>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
