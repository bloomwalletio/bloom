<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { onMount } from 'svelte'

    import { Button, IconName, TextInput } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
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

    enum NetworkAddressField {
        Name = 'name',
        Address = 'address',
    }

    let validationErrors: { [key in NetworkAddressField]: string | undefined }[] = []

    function onRemoveAddressClick(indexToRemove: number): void {
        validationErrors = validationErrors.filter((_, index) => index !== indexToRemove)
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
        validationErrors.push({ [NetworkAddressField.Name]: undefined, [NetworkAddressField.Address]: undefined })
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

    function onCancelClick(): void {
        drawerRouter.previous()
    }

    function validate(): boolean {
        let handledError = false
        const addresses = [...savedAddresses, ...newAddresses]
        addresses.forEach((_, index) => {
            if (index < savedAddresses.length) {
                tryValidationFunction(
                    () => {
                        if (hasAddressNameChanged(savedAddresses[index].addressName, savedAddresses[index].address)) {
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
                    },
                    index,
                    NetworkAddressField.Name
                )
            } else {
                tryValidationFunction(
                    () =>
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
                        ),
                    index,
                    NetworkAddressField.Name
                )
                tryValidationFunction(
                    () => {
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
                    },
                    index,
                    NetworkAddressField.Address
                )
            }

            if (Object.values(validationErrors[index]).some((error) => Boolean(error))) {
                handledError = true
            }
        })

        return !handledError
    }

    function tryValidationFunction(
        validationFunction: () => void,
        fieldIndex: number,
        fieldName: NetworkAddressField
    ): void {
        try {
            validationFunction()
        } catch (err) {
            if (validationErrors[fieldIndex] && fieldName in validationErrors[fieldIndex])
                validationErrors[fieldIndex][fieldName] = err.message
        }
    }

    function hasAddressNameChanged(name: string, address: string): boolean {
        const contactAddresses: IContactAddress[] = Object.values(
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
        savedAddresses.forEach((contactAddress) => {
            validationErrors.push({
                [NetworkAddressField.Name]: contactAddress.addressName,
                [NetworkAddressField.Address]: contactAddress.address,
            })
        })
    })
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.EditNetworkAddresses}.title`)}
    {drawerRouter}
>
    <form on:submit|preventDefault={onSaveClick} id="edit-network-addresses-form" class="flex flex-col gap-6 px-6">
        {#each [...savedAddresses, ...newAddresses] as _, index}
            <div
                class="flex flex-col justify-between gap-3 p-4 bg-surface dark:bg-surface-dark
                border border-solid border-stroke dark:border-stroke-dark rounded-lg"
                data-index={_}
            >
                {#if index < savedAddresses.length}
                    <TextInput
                        bind:value={savedAddresses[index].address}
                        bind:error={validationErrors[index][NetworkAddressField.Address]}
                        disabled
                        label={localize('general.address')}
                    />
                    <TextInput
                        bind:this={savedAddressNameInputs[index]}
                        bind:value={savedAddresses[index].addressName}
                        bind:error={validationErrors[index][NetworkAddressField.Name]}
                        label={localize('general.addressName')}
                    />
                {:else}
                    <TextInput
                        bind:this={newAddressInputs[index - savedAddresses.length]}
                        bind:value={newAddresses[index - savedAddresses.length].address}
                        bind:error={validationErrors[index][NetworkAddressField.Address]}
                        label={localize('general.address')}
                    />
                    <TextInput
                        bind:this={newAddressNameInputs[index - savedAddresses.length]}
                        bind:value={newAddresses[index - savedAddresses.length].addressName}
                        bind:error={validationErrors[index][NetworkAddressField.Name]}
                        label={localize('general.addressName')}
                    />
                {/if}
                <Button
                    variant="outlined"
                    color="danger"
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
            text={localize('general.addAddress')}
            icon={IconName.Plus}
            width="full"
            on:click={onAddNewAddressClick}
        />
    </form>
    <div slot="footer" class="flex gap-4">
        <Button variant="outlined" text={localize('actions.cancel')} width="half" on:click={onCancelClick} />
        <Button type="submit" form="edit-network-addresses-form" width="half" text={localize('actions.save')} />
    </div>
</DrawerTemplate>
