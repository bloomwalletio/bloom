<script lang="ts">
    import { Button, Copyable } from '@bloomwalletio/ui'
    import { IContact, IContactAddressMap } from '@core/contact'
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { NetworkId, getNameFromNetworkId } from '@core/network'
    import { Router } from '@core/router'
    import { truncateString } from '@core/utils'
    import { SendFlowType, SubjectType, setSendFlowParameters } from '@core/wallet'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { NetworkAvatar, Text } from '@ui'
    import { FontWeight, TextType } from '@ui/enums'
    import { SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { ContactAddressMenu } from './menus'

    export let drawerRouter: Router<unknown>
    export let networkId: NetworkId
    export let contact: IContact
    export let contactAddressMap: IContactAddressMap

    function onSendClick(address: string): void {
        setSendFlowParameters({
            type: SendFlowType.BaseCoinTransfer,
            destinationNetworkId: networkId,
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
            <NetworkAvatar {networkId} size="xs" />
            <Text fontSize="text-16" fontWeight={FontWeight.semibold}>{getNameFromNetworkId(networkId)}</Text>
        </div>
        <ContactAddressMenu {drawerRouter} {networkId} />
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
