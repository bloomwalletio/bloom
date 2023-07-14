<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, NetworkInput, TextInput, HR } from '@ui'
    import { DrawerTemplate } from '@components'

    import {
        ContactManager,
        validateContactAddress,
        validateContactAddressName,
        validateContactName,
        validateContactNetworkSelection,
        validateContactNote,
    } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    export let drawerRouter: Router<unknown>

    let name,
        note,
        address,
        addressName: string = ''
    let networkSelection: { networkId: string; address?: string } | undefined
    let nameInput, noteInput, addressNameInput, addressInput: TextInput
    let networkSelectionInput: NetworkInput

    function onSaveClick(): void {
        const contact = { name, note }
        const networkAddress = { networkId: networkSelection?.networkId, addressName, address }

        if (validate()) {
            ContactManager.addContact(contact, networkAddress)
            drawerRouter.previous()
        }
    }

    function validate(): boolean {
        let handledError = false
        for (const input of [nameInput, noteInput, networkSelectionInput, addressNameInput, addressInput]) {
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
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddContact}.title`)}
    {drawerRouter}
>
    <add-contact class="flex flex-col gap-4">
        <TextInput
            bind:this={nameInput}
            bind:value={name}
            placeholder={localize('general.name')}
            label={localize('general.name')}
            validationFunction={validateContactName}
        />
        <TextInput
            bind:this={noteInput}
            bind:value={note}
            placeholder={localize('views.dashboard.drawers.contactBook.addContact.optionalNote')}
            label={localize('views.dashboard.drawers.contactBook.addContact.optionalNote')}
            validationFunction={validateContactNote}
        />
        <HR />
        <NetworkInput
            bind:this={networkSelectionInput}
            bind:networkSelection
            showLayer2={true}
            validationFunction={validateContactNetworkSelection}
        />
        <TextInput
            bind:this={addressNameInput}
            bind:value={addressName}
            placeholder={localize('general.addressName')}
            label={localize('general.addressName')}
            validationFunction={validateContactAddressName}
        />
        <TextInput
            bind:this={addressInput}
            bind:value={address}
            placeholder={localize('general.address')}
            label={localize('general.address')}
            validationFunction={() => validateContactAddress(address, networkSelection?.networkId)}
        />
    </add-contact>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
