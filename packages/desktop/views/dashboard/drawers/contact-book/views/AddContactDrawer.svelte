<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { NetworkInput, TextInput } from '@ui'
    import { Button } from '@bloomwalletio/ui'
    
    
    import {
        ContactManager,
        validateContactAddress,
        validateContactAddressName,
        validateContactName,
        validateContactNetworkSelection,
        validateContactNote,
    } from '@core/contact'
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    let name,
        note,
        address,
        addressName: string = ''
    let selectedNetworkId: NetworkId | undefined
    let nameInput, noteInput, addressNameInput, addressInput: TextInput
    let networkSelectionInput: NetworkInput

    /**
     * NOTE: This improves UX slightly by forcing the address-related input errors
     * to be reset when the network selection changes.
     */
    $: selectedNetworkId, resetErrors()

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
        const networkAddress = { networkId: selectedNetworkId, addressName, address }

        if (validate()) {
            ContactManager.addContact(contact, networkAddress)
            if (drawerRouter.hasHistory()) {
                drawerRouter.previous()
            } else {
                drawerRouter.goTo(ContactBookRoute.ContactList)
                drawerRouter.resetHistory()
            }
        }
    }

    function validate(): boolean {
        /**
         * NOTE: This variable allows us to run all the input validation functions,
         * displaying all errors at once rather than one by one.
         */
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
            placeholder={localize('general.optionalField', { field: localize('general.note') })}
            label={localize('general.note')}
            validationFunction={validateContactNote}
        />
        <hr />
        <NetworkInput
            bind:this={networkSelectionInput}
            bind:networkId={selectedNetworkId}
            bind:error={networkSelectionError}
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
                validateContactAddress({ value: address, isRequired: true, mustBeUnique: true }, selectedNetworkId)}
        />
    </add-contact>
    <div slot="footer">
        <Button text={localize('actions.save')} on:click={onSaveClick} width="full" />
    </div>
</DrawerTemplate>
