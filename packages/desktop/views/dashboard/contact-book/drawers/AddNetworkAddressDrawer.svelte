<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, TextInput, NetworkInput } from '@ui'
    import { DrawerTemplate } from '@components'

    import {
        ContactManager,
        selectedContact,
        validateContactAddress,
        validateContactAddressName,
        validateContactNetworkSelection,
    } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    export let drawerRouter: Router<unknown>

    let addressInput, addressNameInput: TextInput
    let networkSelectionInput: NetworkInput
    let address: string = ''
    let addressName: string = ''
    let networkSelection: { networkId: string; address?: string } | undefined

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
        if (validate()) {
            ContactManager.addContactAddress($selectedContact?.id, networkSelection?.networkId, addressName, address)
            drawerRouter.previous()
        }
    }

    function validate(): boolean {
        /**
         * NOTE: This variable allows us to run all the input validation functions,
         * displaying all errors at once rather than one by one.
         */
        let handledError = false
        for (const input of [addressInput, addressNameInput, networkSelectionInput]) {
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
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddNetworkAddress}.title`)}
    {drawerRouter}
>
    <add-address class="flex flex-col gap-4">
        <NetworkInput
            bind:this={networkSelectionInput}
            bind:networkSelection
            bind:error={networkSelectionError}
            showLayer2={true}
            validationFunction={() => validateContactNetworkSelection(networkSelection?.networkId)}
        />
        <TextInput
            bind:this={addressNameInput}
            bind:value={addressName}
            bind:error={addressNameError}
            placeholder={localize('general.addressName')}
            validationFunction={() =>
                validateContactAddressName(
                    { value: addressName, isRequired: true, checkLength: true, mustBeUnique: true },
                    $selectedContact?.id,
                    networkSelection.networkId
                )}
        />
        <TextInput
            bind:this={addressInput}
            bind:value={address}
            bind:error={addressError}
            placeholder={localize('general.address')}
            validationFunction={() =>
                validateContactAddress(
                    { value: address, isRequired: true, mustBeUnique: true },
                    networkSelection?.networkId
                )}
        />
    </add-address>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
