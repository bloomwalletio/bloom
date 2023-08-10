<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { onMount } from 'svelte'

    import { Button, FlatIconName } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { TextInput } from '@ui'

    import {
        ContactManager,
        IContactAddress,
        selectedContact,
        selectedContactNetworkId,
        validateContactAddress,
        validateContactAddressName,
    } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'

    import { showNotification } from '@auxiliary/notification'

    export let drawerRouter: Router<unknown>

    let addressesToRemove: string[] = []

    let savedAddresses: IContactAddress[] = []
    let savedAddressNameInputs: TextInput[] = []

    let newAddresses: IContactAddress[] = []
    let newAddressInputs: TextInput[] = []
    let newAddressNameInputs: TextInput[] = []

    function onRemoveAddressClick(indexToRemove: number): void {
        const isSavedAddress = indexToRemove < savedAddresses.length
        if (isSavedAddress) {
            addressesToRemove = [...addressesToRemove, savedAddresses[indexToRemove].address]
            savedAddressNameInputs = savedAddressNameInputs.filter((_, index) => index !== indexToRemove)
            savedAddresses = savedAddresses.filter((_, index) => index !== indexToRemove)
        } else {
            /**
             * CAUTION: Because the index is from a combined array with the new addresses
             * coming last, the index must be adjusted to accommodate the length of the
             * saved addresses.
             */
            const adjustedIndex = indexToRemove - savedAddresses.length
            addressesToRemove = [...addressesToRemove, newAddresses[adjustedIndex].address]
            newAddressInputs = newAddressInputs.filter((_, index) => index !== adjustedIndex)
            newAddressNameInputs = newAddressNameInputs.filter((_, index) => index !== adjustedIndex)
            newAddresses = newAddresses.filter((_, index) => index !== adjustedIndex)
        }
    }

    function onAddNewAddressClick(): void {
        newAddressInputs.push(undefined)
        newAddressNameInputs.push(undefined)
        newAddresses.push({
            contactId: $selectedContact.id,
            networkId: $selectedContactNetworkId,
            addressName: '',
            address: '',
        })
        newAddresses = newAddresses
    }

    function onSaveClick(): void {
        try {
            if (validate()) {
                if (addressesToRemove.length) {
                    ContactManager.deleteContactAddresses(
                        $selectedContact.id,
                        $selectedContactNetworkId,
                        addressesToRemove
                    )
                }
                ContactManager.updateContactAddresses($selectedContact.id, [...savedAddresses, ...newAddresses])
                showNotification({
                    variant: 'success',
                    text: localize('notifications.updateNetworkAddresses.success'),
                })
                drawerRouter.previous()
            }
        } catch (err) {
            console.error(err)
        }
    }

    function validate(): boolean {
        /**
         * NOTE: This variable allows us to run all the input validation functions,
         * displaying all errors at once rather than one by one.
         */
        let handledError = false
        for (const input of [...savedAddressNameInputs, ...newAddressInputs, ...newAddressNameInputs]) {
            try {
                if (input) {
                    input.validate()
                }
            } catch (err) {
                handledError = true
            }
        }
        return !handledError
    }

    function hasAddressNameChanged(name: string, address: string): boolean {
        const contactAddresses = Object.values(
            ContactManager.getNetworkContactAddressMapForContact($selectedContact?.id)?.[$selectedContactNetworkId] ??
                {}
        )
        return contactAddresses.some((contactAddress) => {
            if (contactAddress.address === address) {
                return contactAddress.addressName !== name
            } else {
                return false
            }
        })
    }

    onMount(() => {
        const contactAddresses = ContactManager.getNetworkContactAddressMapForContact($selectedContact?.id)
        savedAddresses = Object.values(contactAddresses?.[$selectedContactNetworkId] ?? {}) || []
        savedAddressNameInputs = savedAddresses.map(() => undefined)
    })
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditNetworkAddresses}.title`)}
    {drawerRouter}
>
    <update-addresses class="flex flex-col gap-4">
        {#each [...savedAddresses, ...newAddresses] as address, index}
            <div
                class="flex flex-col justify-between gap-2 p-4 border border-solid border-gray-300 rounded-lg dark:border-transparent dark:bg-gray-900"
            >
                {#if index < savedAddresses.length}
                    <TextInput
                        bind:value={savedAddresses[index].address}
                        disabled
                        placeholder={localize('general.address')}
                        label={localize('general.address')}
                    />
                    <TextInput
                        bind:this={savedAddressNameInputs[index]}
                        bind:value={savedAddresses[index].addressName}
                        placeholder={localize('general.addressName')}
                        label={localize('general.addressName')}
                        validationFunction={() => {
                            if (
                                hasAddressNameChanged(savedAddresses[index].addressName, savedAddresses[index].address)
                            ) {
                                validateContactAddressName(
                                    {
                                        value: savedAddresses[index].addressName,
                                        isRequired: true,
                                        mustBeUnique: addressesToRemove.includes(savedAddresses[index].address),
                                        checkLength: true,
                                    },
                                    $selectedContact?.id,
                                    $selectedContactNetworkId
                                )
                            }
                        }}
                    />
                {:else}
                    <TextInput
                        bind:this={newAddressInputs[index - savedAddresses.length]}
                        bind:value={newAddresses[index - savedAddresses.length].address}
                        placeholder={localize('general.address')}
                        label={localize('general.address')}
                        validationFunction={() => {
                            validateContactAddress(
                                {
                                    value: newAddresses[index - savedAddresses.length].address,
                                    isRequired: true,
                                    mustBeUnique: !addressesToRemove.includes(
                                        newAddresses[index - savedAddresses.length].address
                                    ),
                                },
                                $selectedContactNetworkId
                            )
                        }}
                    />
                    <TextInput
                        bind:this={newAddressNameInputs[index - savedAddresses.length]}
                        bind:value={newAddresses[index - savedAddresses.length].addressName}
                        placeholder={localize('general.addressName')}
                        label={localize('general.addressName')}
                        validationFunction={() =>
                            validateContactAddressName(
                                {
                                    value: newAddresses[index - savedAddresses.length].addressName,
                                    mustBeUnique: !addressesToRemove.includes(
                                        newAddresses[index - savedAddresses.length].address
                                    ),
                                    isRequired: true,
                                    checkLength: true,
                                },
                                $selectedContact?.id,
                                $selectedContactNetworkId
                            )}
                    />
                {/if}
                <Button
                    variant="outline"
                    color="red"
                    text={localize('actions.remove')}
                    size="sm"
                    width="full"
                    disabled={[...savedAddresses, ...newAddresses].length === 1}
                    on:click={() => onRemoveAddressClick(index)}
                />
            </div>
        {/each}
        <Button
            variant="text"
            text={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditNetworkAddresses}.addAddress`)}
            icon={FlatIconName.Plus}
            width="full"
            on:click={onAddNewAddressClick}
        />
    </update-addresses>
    <div slot="footer">
        <Button on:click={onSaveClick} width="full" text={localize('actions.save')} />
    </div>
</DrawerTemplate>
