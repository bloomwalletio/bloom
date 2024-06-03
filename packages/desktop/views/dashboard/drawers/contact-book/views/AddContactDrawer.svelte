<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { Button, ColorPicker, Text, TextInput } from '@bloomwalletio/ui'

    import { NetworkInput } from '@ui'
    import { DrawerTemplate } from '@components'

    import { getRandomAccountColor } from '@core/account'
    import {
        ContactManager,
        validateContactAddress,
        validateContactAddressName,
        validateContactName,
        validateContactNote,
    } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { NetworkId } from '@core/network'
    import { closeDrawer } from '@desktop/auxiliary/drawer'

    export let drawerRouter: Router<unknown>

    let name,
        note,
        address,
        addressName: string = ''
    let selectedNetworkId: NetworkId | undefined
    let nameInput, noteInput, addressNameInput, addressInput: TextInput
    let networkSelectionInput: NetworkInput
    let color: string = getRandomAccountColor()

    /**
     * NOTE: This improves UX slightly by forcing the address-related input errors
     * to be reset when the network selection changes.
     */
    $: selectedNetworkId, resetErrors()

    enum ContactField {
        Name = 'name',
        Note = 'note',
        Network = 'network',
        AddressName = 'addressName',
        Address = 'address',
    }

    let validationErrors: Record<ContactField, string | undefined> = {
        [ContactField.Name]: undefined,
        [ContactField.Note]: undefined,
        [ContactField.Network]: undefined,
        [ContactField.AddressName]: undefined,
        [ContactField.Address]: undefined,
    }

    function resetErrors(): void {
        validationErrors = {
            [ContactField.Name]: undefined,
            [ContactField.Note]: undefined,
            [ContactField.Network]: undefined,
            [ContactField.AddressName]: undefined,
            [ContactField.Address]: undefined,
        }
    }

    function onSaveClick(): void {
        const contact = { name, note, color }
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

    function onCancelClick(): void {
        if (drawerRouter.hasHistory()) {
            drawerRouter.previous()
        } else {
            closeDrawer()
        }
    }

    function validate(): boolean {
        tryValidationFunction(() => validateContactName(name), ContactField.Name)
        tryValidationFunction(() => validateContactNote(note), ContactField.Note)
        tryValidationFunction(
            () => validateContactAddressName({ value: addressName, isRequired: true, checkLength: true }),
            ContactField.AddressName
        )
        tryValidationFunction(
            () => validateContactAddress({ value: address, isRequired: true, mustBeUnique: true }, selectedNetworkId),
            ContactField.Address
        )

        return Object.values(validationErrors).filter((value) => !!value).length < 1
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
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddContact}.title`)}
    {drawerRouter}
>
    <form on:submit|preventDefault={onSaveClick} id="add-contact-form" class="flex flex-col gap-4 px-6">
        <TextInput
            bind:this={nameInput}
            bind:value={name}
            bind:error={validationErrors[ContactField.Name]}
            label={localize('general.name')}
        />
        <TextInput
            bind:this={noteInput}
            bind:value={note}
            bind:error={validationErrors[ContactField.Note]}
            label={localize('general.optionalField', { field: localize('general.note') })}
        />
        <hr />
        <NetworkInput
            bind:this={networkSelectionInput}
            bind:networkId={selectedNetworkId}
            bind:error={validationErrors[ContactField.Network]}
            mergeLayer2Options
        />
        <TextInput
            bind:this={addressInput}
            bind:value={address}
            bind:error={validationErrors[ContactField.Address]}
            label={localize('general.address')}
        />
        <TextInput
            bind:this={addressNameInput}
            bind:value={addressName}
            bind:error={validationErrors[ContactField.AddressName]}
            label={localize('general.addressName')}
        />
        <hr />
        <Text type="body2">{localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddContact}.color`)}</Text>
        <ColorPicker bind:value={color} />
    </form>
    <div slot="footer" class="flex gap-4">
        <Button variant="outlined" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button
            type="submit"
            form="add-contact-form"
            text={localize('actions.save')}
            on:click={onSaveClick}
            width="half"
        />
    </div>
</DrawerTemplate>

<style lang="postcss">
    hr {
        @apply border-stroke dark:border-stroke-dark;
    }
</style>
