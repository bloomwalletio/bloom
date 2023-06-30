<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '@components'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'
    import { Button, NetworkInput, TextInput, HR } from '@ui'
    import { ContactManager } from '@core/contacts'

    export let drawerRouter: Router<unknown>

    let name: string = ''
    let note: string = ''
    let address: string = ''
    let addressName: string = ''
    let networkSelection: { networkId: string; address?: string } | undefined

    function onSaveClick(): void {
        const contact = { name, note }
        const networkAddress = { networkId: networkSelection?.networkId, addressName, address }

        ContactManager.addContact(contact, networkAddress)

        drawerRouter.previous()
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddContact}.title`)}
    {drawerRouter}
>
    <div class="h-full flex flex-col justify-between">
        <div class="flex flex-col gap-4">
            <TextInput bind:value={name} placeholder={localize('general.name')} />
            <TextInput bind:value={note} placeholder={localize('general.note')} />
            <HR />
            <NetworkInput bind:networkSelection showLayer2={true} />
            <TextInput bind:value={addressName} placeholder={localize('general.addressName')} />
            <TextInput bind:value={address} placeholder={localize('general.address')} />
        </div>
        <Button onClick={onSaveClick}>{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
