<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { NetworkInput, TextInput } from '@ui'
    import { Button } from '@bloomwalletio/ui'
    import {
        ContactManager,
        selectedContact,
        validateContactAddress,
        validateContactAddressName,
        validateContactNetworkSelection,
    } from '@core/contact'
    import { localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    let addressInput, addressNameInput: TextInput
    let networkSelectionInput: NetworkInput
    let address: string = ''
    let addressName: string = ''
    let selectedNetworkId: NetworkId | undefined

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
        if (validate()) {
            ContactManager.addContactAddress($selectedContact?.id, selectedNetworkId, addressName, address)
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
            bind:networkId={selectedNetworkId}
            bind:error={networkSelectionError}
            validationFunction={() => validateContactNetworkSelection(selectedNetworkId)}
        />
        <TextInput
            bind:this={addressNameInput}
            bind:value={addressName}
            bind:error={addressNameError}
            placeholder={localize('general.addressName')}
            label={localize('general.addressName')}
            validationFunction={() =>
                validateContactAddressName(
                    { value: addressName, isRequired: true, checkLength: true, mustBeUnique: true },
                    $selectedContact?.id,
                    selectedNetworkId
                )}
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
    </add-address>
    <div slot="footer">
        <Button text={localize('actions.save')} width="full" on:click={onSaveClick} />
    </div>
</DrawerTemplate>
