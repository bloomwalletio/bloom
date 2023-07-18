<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { onMount } from 'svelte'

    import { Button, Icon, Text, TextInput } from '@ui'
    import { ButtonSize, ButtonVariant, FontWeight } from '@ui/enums'
    import { DrawerTemplate } from '@components'

    import { ContactManager, IContactAddress, selectedContact, selectedContactNetworkId } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    import { Icon as IconEnum } from '@auxiliary/icon'
    import { showAppNotification } from '@auxiliary/notification'

    export let drawerRouter: Router<unknown>

    let addresses: IContactAddress[] = []
    let addressesToRemove: string[] = []
    let inputs: TextInput[] = []

    function onRemoveAddressClick(indexToRemove: number): void {
        addressesToRemove = [...addressesToRemove, addresses[indexToRemove].address]
        inputs = inputs.filter((_, index) => index !== indexToRemove)
        addresses = addresses.filter((_, index) => index !== indexToRemove)
    }

    function onAddAddressClick(): void {
        addresses = [
            ...addresses,
            { contactId: $selectedContact.id, networkId: $selectedContactNetworkId, addressName: '', address: '' },
        ]
        inputs = [...inputs, undefined]
    }

    function onSaveClick(): void {
        try {
            if (validate()) {
                ContactManager.updateContactAddresses($selectedContact.id, addresses)
                if (addressesToRemove.length) {
                    ContactManager.deleteContactAddresses(
                        $selectedContact.id,
                        $selectedContactNetworkId,
                        addressesToRemove
                    )
                }
                showAppNotification({
                    type: 'success',
                    message: localize('notifications.updateNetworkAddresses.success'),
                    alert: true,
                })
                drawerRouter.previous()
            }
        } catch (err) {
            console.error(err)
        }
    }

    function validate(): boolean {
        for (const input of inputs) {
            try {
                input.validate()
            } catch (err) {
                return false
            }
        }
        return true
    }

    function isInitialAddress(address: IContactAddress): boolean {
        return ContactManager.getContact($selectedContact?.id).addresses.some(
            (_address) => _address === address.address
        )
    }

    onMount(() => {
        const contactAddresses = ContactManager.getNetworkContactAddressMapForContact($selectedContact?.id)
        addresses = Object.values(contactAddresses?.[$selectedContactNetworkId] ?? {}) || []
        inputs = addresses.map(() => undefined)
    })
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditNetworkAddresses}.title`)}
    {drawerRouter}
>
    <update-addresses class="flex flex-col gap-4">
        {#each addresses as address, index}
            <div
                class="flex flex-col justify-between gap-2 p-4 border border-solid border-gray-300 rounded-lg dark:border-transparent dark:bg-gray-900"
            >
                <TextInput
                    bind:value={addresses[index].address}
                    disabled={isInitialAddress(address)}
                    placeholder={localize('general.address')}
                    label={localize('general.address')}
                />
                <TextInput
                    bind:this={inputs[index]}
                    bind:value={addresses[index].addressName}
                    placeholder={localize('general.addressName')}
                    label={localize('general.addressName')}
                />
                <Button
                    outline
                    size={ButtonSize.Small}
                    variant={ButtonVariant.Warning}
                    classes="flex-1"
                    disabled={addresses.length === 1}
                    onClick={() => onRemoveAddressClick(index)}
                >
                    {localize('actions.remove')}
                </Button>
            </div>
        {/each}
        <button
            type="button"
            on:click={onAddAddressClick}
            class="w-full flex justify-center items-center text-blue-500 gap-2"
        >
            <Icon icon={IconEnum.Plus} width={12} height={12} />
            <Text fontSize="14" fontWeight={FontWeight.semibold} classes="text-blue-500" overrideColor>
                {localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditNetworkAddresses}.addAddress`)}
            </Text>
        </button>
    </update-addresses>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
