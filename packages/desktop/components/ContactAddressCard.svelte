<script lang="ts">
    import { SupportedNetworkId } from '@core/network'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Button } from '@bloomwalletio/ui'
    import { IContact, IContactAddressMap, setSelectedContactNetworkId } from '@core/contact'
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { Router } from '@core/router'
    import { truncateString } from '@core/utils'
    import { SendFlowType, SubjectType, setSendFlowParameters } from '@core/wallet'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { Copyable, MeatballMenuButton, MenuItem, Modal, NetworkIcon, Text } from '@ui'
    import { FontWeight, TextType } from '@ui/enums'
    import { ContactBookRoute } from '@views/dashboard/drawers/contact-book/contact-book-route.enum'
    import { SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'

    export let drawerRouter: Router<unknown>
    export let networkId: string
    export let contact: IContact
    export let contactAddressMap: IContactAddressMap

    let modal: Modal

    function onEditNetworkAddressesClick(networkId: string): void {
        setSelectedContactNetworkId(networkId)
        drawerRouter.goTo(ContactBookRoute.EditNetworkAddresses)
    }

    function onRemoveNetworkClick(networkId: string): void {
        setSelectedContactNetworkId(networkId)
        drawerRouter.goTo(ContactBookRoute.RemoveNetworkAddresses)
    }

    function onSendClick(address: string): void {
        // TODO: after network id refactor we need to set the chain id here so that the recipient selector works correctly
        setSendFlowParameters({
            type: SendFlowType.BaseCoinTransfer,
            recipient: { type: SubjectType.Contact, contact, address },
        })
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        sendFlowRouter.set(new SendFlowRouter(undefined))
        closeDrawer()
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

<contact-address-card
    class="flex flex-col justify-between bg-gray-50 dark:bg-gray-900 p-4 gap-4 border border-solid border-gray-200 dark:border-transparent rounded-xl"
>
    <contact-address-head class="flex justify-between">
        <div class="flex items-center gap-2">
            <NetworkIcon networkId={SupportedNetworkId.Testnet} />
            <Text fontSize="text-16" fontWeight={FontWeight.semibold}>{networkId}</Text>
        </div>
        <contact-address-menu class="block relative">
            <MeatballMenuButton onClick={modal?.toggle} classes="py-2" />
            <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
                <div class="flex flex-col">
                    {#if features.contacts.editNetworkAddresses.enabled}
                        <MenuItem
                            icon={IconEnum.Edit}
                            iconProps={{ height: 18 }}
                            title={'Edit network addresses'}
                            onClick={() => onEditNetworkAddressesClick(networkId)}
                        />
                    {/if}
                    {#if features.contacts.removeNetwork.enabled}
                        <MenuItem
                            icon={IconEnum.Delete}
                            title={'Remove network'}
                            onClick={() => onRemoveNetworkClick(networkId)}
                            variant="error"
                        />
                    {/if}
                </div>
            </Modal>
        </contact-address-menu>
    </contact-address-head>
    {#each Object.values(contactAddressMap) as contactAddress}
        <contact-address-item class="flex justify-between items-end gap-4">
            <div class="flex flex-col">
                <Text overrideColor classes="text-gray-600 text-left w-full truncate" fontWeight={FontWeight.medium}>
                    {contactAddress.addressName}
                </Text>
                <Copyable value={contactAddress.address}>
                    <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.medium}>
                        {truncateString(contactAddress.address, 9, 9)}
                    </Text>
                </Copyable>
            </div>
            {#if features.contacts.sendTo.enabled}
                <Button
                    size="sm"
                    text={localize('actions.send')}
                    on:click={() => onSendClick(contactAddress.address)}
                />
            {/if}
        </contact-address-item>
    {/each}
</contact-address-card>
