<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button } from '@bloomwalletio/ui'
    import { Text, TextHint } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager, selectedContact, selectedContactNetworkId } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { getNameFromNetworkId } from '@core/network'

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
    <remove-addresses class="flex flex-col gap-4">
        <Text>
            {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveNetworkAddresses}.body`, {
                values: { network: getNameFromNetworkId($selectedContactNetworkId) },
            })}
        </Text>
        <TextHint
            icon="exclamation"
            warning
            text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.RemoveNetworkAddresses}.hint`)}
        />
    </remove-addresses>
    <div slot="footer" class="flex gap-4">
        <Button variant="outline" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button color="yellow" text={localize('actions.remove')} width="half" on:click={onRemoveClick} />
    </div>
</DrawerTemplate>
