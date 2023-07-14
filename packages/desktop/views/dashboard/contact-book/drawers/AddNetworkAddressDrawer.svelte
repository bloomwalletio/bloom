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

    function onSaveClick(): void {
        if (validate()) {
            ContactManager.addContactAddress($selectedContact?.id, networkSelection?.networkId, addressName, address)
            drawerRouter.previous()
        }
    }

    function validate(): boolean {
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
            showLayer2={true}
            validationFunction={() => validateContactNetworkSelection(networkSelection?.networkId)}
        />
        <TextInput
            bind:this={addressNameInput}
            bind:value={addressName}
            placeholder={localize('general.addressName')}
            validationFunction={() =>
                validateContactAddressName(
                    { value: addressName, isRequired: true, checkLength: true, mustBeUnique: true },
                    networkSelection.networkId
                )}
        />
        <TextInput
            bind:this={addressInput}
            bind:value={address}
            placeholder={localize('general.address')}
            validationFunction={() => validateContactAddress(address, networkSelection?.networkId)}
        />
    </add-address>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
