<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { onMount } from 'svelte'

    import { Button, Icon, Text, TextInput } from '@ui'
    import { ButtonSize, ButtonVariant, FontWeight } from '@ui/enums'
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

    import { Icon as IconEnum } from '@auxiliary/icon'
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
                    outline
                    size={ButtonSize.Small}
                    variant={ButtonVariant.Warning}
                    classes="flex-1"
                    disabled={[...savedAddresses, ...newAddresses].length === 1}
                    onClick={() => onRemoveAddressClick(index)}
                >
                    {localize('actions.remove')}
                </Button>
            </div>
        {/each}
        <button
            type="button"
            on:click={onAddNewAddressClick}
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
