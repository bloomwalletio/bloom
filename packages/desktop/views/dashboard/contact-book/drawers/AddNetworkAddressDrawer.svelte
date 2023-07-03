<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, TextInput, NetworkInput } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager, selectedContact } from '@core/contacts'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    export let drawerRouter: Router<unknown>

    let address: string = ''
    let addressName: string = ''
    let networkSelection: { networkId: string; address?: string } | undefined

    function onSaveClick(): void {
        ContactManager.addContactAddress(
            $selectedContact?.id,
            networkSelection?.networkId,
            addressName,
            address
        )

        drawerRouter.previous()
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddNetworkAddress}.title`)}
    {drawerRouter}
>
    <add-address class="flex flex-col gap-4">
        <NetworkInput bind:networkSelection showLayer2={true} />
        <TextInput bind:value={addressName} placeholder={localize('general.addressName')} />
        <TextInput bind:value={address} placeholder={localize('general.address')} />
    </add-address>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
