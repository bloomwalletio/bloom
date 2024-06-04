<script lang="ts">
    import { Button, TextInput } from '@bloomwalletio/ui'
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
    import { NetworkInput } from '@ui'
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { NetworkId } from '@core/network'

    export let drawerRouter: Router<unknown>

    let networkSelectionInput: NetworkInput
    let address: string = ''
    let addressName: string = ''
    let selectedNetworkId: NetworkId | undefined

    /**
     * NOTE: This improves UX slightly by forcing the address-related input errors
     * to be reset when the network selection changes.
     */
    $: selectedNetworkId, resetErrors()

    enum AddressField {
        Address = 'address',
        Name = 'name',
        Network = 'network',
    }

    let validationErrors: { [key in AddressField]: string | undefined } = {
        [AddressField.Address]: undefined,
        [AddressField.Name]: undefined,
        [AddressField.Network]: undefined,
    }

    function resetErrors(): void {
        validationErrors = {
            [AddressField.Address]: undefined,
            [AddressField.Name]: undefined,
            [AddressField.Network]: undefined,
        }
    }

    function onSaveClick(): void {
        if (validate()) {
            ContactManager.addContactAddress($selectedContact?.id, selectedNetworkId, addressName, address)
            drawerRouter.previous()
        }
    }

    function onCancelClick(): void {
        drawerRouter.previous()
    }

    function validate(): boolean {
        tryValidationFunction(() => validateContactNetworkSelection(selectedNetworkId), AddressField.Network)
        tryValidationFunction(
            () =>
                validateContactAddressName(
                    { value: addressName, isRequired: true, checkLength: true, mustBeUnique: true },
                    $selectedContact?.id,
                    selectedNetworkId
                ),
            AddressField.Name
        )
        tryValidationFunction(
            () => validateContactAddress({ value: address, isRequired: true, mustBeUnique: true }, selectedNetworkId),
            AddressField.Address
        )

        return !Object.values(validationErrors).some((error) => error !== undefined && error !== '')
    }

    function tryValidationFunction(validationFunction: () => void, fieldName: AddressField): void {
        try {
            validationFunction()
        } catch (err) {
            validationErrors[fieldName] = err.message
        }
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddNetworkAddress}.title`)}
    {drawerRouter}
>
    <form on:submit|preventDefault={onSaveClick} id="add-network-address-form" class="flex flex-col gap-4 px-6">
        <NetworkInput
            bind:this={networkSelectionInput}
            bind:networkId={selectedNetworkId}
            bind:error={validationErrors[AddressField.Network]}
            mergeLayer2Options
        />
        <TextInput
            bind:value={address}
            bind:error={validationErrors[AddressField.Address]}
            label={localize('general.address')}
        />
        <TextInput
            bind:value={addressName}
            bind:error={validationErrors[AddressField.Name]}
            label={localize('general.addressName')}
        />
    </form>
    <div slot="footer" class="flex gap-4">
        <Button variant="outlined" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button type="submit" form="add-network-address-form" text={localize('actions.save')} width="half" />
    </div>
</DrawerTemplate>
