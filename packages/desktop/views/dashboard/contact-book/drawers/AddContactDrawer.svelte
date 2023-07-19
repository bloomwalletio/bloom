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

    /**
     * NOTE: This improves UX slightly by forcing the address-related input errors
     * to be reset when the network selection changes.
     */
    $: networkSelection?.networkId, resetErrors()

    let addressError,
        addressNameError,
        networkSelectionError = ''
    function resetErrors(): void {
        addressError = ''
        addressNameError = ''
        networkSelectionError = ''
    }

    function onSaveClick(): void {
        const contact = { name, note }
        const networkAddress = { networkId: networkSelection?.networkId, addressName, address }

        if (validate()) {
            ContactManager.addContact(contact, networkAddress)
            drawerRouter.previous()
        }
    }

    function validate(): boolean {
        for (const input of [nameInput, noteInput, networkSelectionInput, addressNameInput, addressInput]) {
            try {
                input.validate()
            } catch (err) {
                return false
            }
        }
        return true
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
            placeholder={localize('general.optionalField', { field: localize('general.note') })}
            label={localize('general.note')}
            validationFunction={validateContactNote}
        />
        <HR />
        <NetworkInput
            bind:this={networkSelectionInput}
            bind:networkSelection
            bind:error={networkSelectionError}
            showLayer2={true}
            validationFunction={validateContactNetworkSelection}
        />
        <TextInput
            bind:this={addressNameInput}
            bind:value={addressName}
            bind:error={addressNameError}
            placeholder={localize('general.addressName')}
            label={localize('general.addressName')}
            validationFunction={() =>
                validateContactAddressName({ value: addressName, isRequired: true, checkLength: true })}
        />
        <TextInput
            bind:this={addressInput}
            bind:value={address}
            bind:error={addressError}
            placeholder={localize('general.address')}
            label={localize('general.address')}
            validationFunction={() =>
                validateContactAddress(
                    { value: address, isRequired: true, mustBeUnique: true },
                    networkSelection?.networkId
                )}
        />
    </add-contact>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
