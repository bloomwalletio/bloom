<script lang="ts">
    import { Button, Text, MeatballMenuButton, MenuItem, Modal, NetworkIcon } from '@ui'
    import { ButtonSize, FontWeight } from '@ui/enums'

    import { IContactAddressMap, setSelectedNetworkId } from '@core/contacts'
    import { NetworkId } from '@core/network'
    import { setClipboard, truncateString } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Router } from '@core/router'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { NewTransactionType, resetNewTokenTransactionDetails, updateNewTransactionDetails } from '@core/wallet'

    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { closeDrawer } from '@desktop/auxiliary/drawer'

    import { ContactBookRoute } from '@views/dashboard/contact-book/contact-book-route.enum'
    import { SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'

    export let drawerRouter: Router<unknown>
    export let networkId: string
    export let contactAddressMap: IContactAddressMap

    let modal: Modal

    function onAddressClick(address: string): void {
        setClipboard(address, true)
    }

    function onEditNetworkAddressesClick(networkId: string): void {
        setSelectedNetworkId(networkId)
        drawerRouter.goTo(ContactBookRoute.UpdateNetworkAddresses)
    }
    
    function onRemoveNetworkClick(networkId: string): void {
        setSelectedNetworkId(networkId)
        drawerRouter.goTo(ContactBookRoute.RemoveNetworkAddresses)
    }

    function onSendClick(address: string): void {
        resetNewTokenTransactionDetails()
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            recipient: { type: 'address', address },
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

<contact-address-card class="flex flex-col justify-between bg-white p-6 gap-4 border border-solid border-gray-200 rounded-xl">
    <contact-address-head class="flex justify-between">
        <div class="flex items-center gap-2">
            <NetworkIcon networkId={NetworkId.Testnet} />
            <Text fontSize="text-16" fontWeight={FontWeight.semibold}>{networkId}</Text>
        </div>
        <contact-address-menu class="block relative">
            <MeatballMenuButton onClick={modal?.toggle} />
            <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
                <div class="flex flex-col">
                    <MenuItem icon={IconEnum.Edit} title={'Edit network addresses'} onClick={() => onEditNetworkAddressesClick(networkId)} />
                    <MenuItem icon={IconEnum.Delete} title={'Remove network'} onClick={() => onRemoveNetworkClick(networkId)} variant="error" />
                </div>
            </Modal>
        </contact-address-menu>
    </contact-address-head>
    {#each Object.values(contactAddressMap) as contactAddress}
        <contact-address-item class="flex justify-between items-center gap-4">
            <button type="button" class="flex flex-col flex-1 min-w-0 truncate" on:click={() => onAddressClick(contactAddress.address)}>
                <Text overrideColor classes="text-gray-600 text-left w-full truncate" fontWeight={FontWeight.medium}>
                    {contactAddress.addressName}
                </Text>
                <Text fontSize="text-16" fontWeight={FontWeight.medium}>
                    {truncateString(contactAddress.address, 9, 9)}
                </Text>
            </button>
            <Button size={ButtonSize.Small} onClick={() => onSendClick(contactAddress.address)}>Send</Button>
        </contact-address-item>
    {/each}
</contact-address-card>
