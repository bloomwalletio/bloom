<script lang="ts">
    import { Alert, Button, Text } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { ContactManager, selectedContact, selectedContactNetworkId } from '@core/contact'
    import { localize } from '@core/i18n'
    import { getNameFromNetworkId } from '@core/network'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>

    function onCancelClick(): void {
        drawerRouter.previous()
    }

    function onRemoveClick(): void {
        ContactManager.deleteContactAddressesForNetwork($selectedContact.id, $selectedContactNetworkId)
        drawerRouter.previous()
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveNetworkAddresses}.title`)}
    {drawerRouter}
>
    <remove-addresses class="flex flex-col gap-4 px-6">
        <Text type="base">
            {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveNetworkAddresses}.body`, {
                values: { network: getNameFromNetworkId($selectedContactNetworkId) },
            })}
        </Text>
        <Alert
            variant="warning"
            text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveNetworkAddresses}.hint`)}
        />
    </remove-addresses>
    <div slot="footer" class="flex gap-4">
        <Button variant="outlined" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button color="danger" text={localize('actions.remove')} width="half" on:click={onRemoveClick} />
    </div>
</DrawerTemplate>
