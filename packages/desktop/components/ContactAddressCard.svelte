<script lang="ts">
    import { Copyable, IconButton, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { IContact, IContactAddress, IContactAddressMap, setSelectedContactNetworkAddress } from '@core/contact'
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { getExplorerUrl, getNameFromNetworkId, getNetwork, NetworkId, NetworkNamespace } from '@core/network'
    import { ExplorerEndpoint } from '@auxiliary/explorer'
    import { Router } from '@core/router'
    import { truncateString } from '@core/utils'
    import { SendFlowType, setSendFlowParameters, SubjectType } from '@core/wallet'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { NetworkAvatar } from '@ui'
    import { SendFlowRouter, sendFlowRouter } from '@views/dashboard/send-flow'
    import { ContactAddressMenu } from './menus'
    import { ContactBookRoute } from '../views/dashboard/drawers'
    import { openUrlInBrowser } from '@core/app'

    export let drawerRouter: Router<ContactBookRoute>
    export let networkId: NetworkId
    export let contact: IContact
    export let contactAddressMap: IContactAddressMap

    const hasExplorer = !!getNetwork(networkId)?.explorer

    function getTitle(): string {
        if (networkId.includes(NetworkNamespace.Evm)) {
            return localize('general.evmAddress')
        }
        return getNameFromNetworkId(networkId) ?? ''
    }

    function onExplorerClick(address: string): void {
        const url = getExplorerUrl(networkId, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }

    function onQrCodeClick(contactAddress: IContactAddress): void {
        setSelectedContactNetworkAddress(contactAddress)
        drawerRouter.goTo(ContactBookRoute.ContactAddress)
    }

    function onSendClick(address: string): void {
        setSendFlowParameters({
            type: SendFlowType.BaseCoinTransfer,
            destinationNetworkId: networkId,
            recipient: { type: SubjectType.Contact, contact, address },
        })
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        sendFlowRouter.set(new SendFlowRouter())
        closeDrawer()
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

<Tile border>
    <contact-address-card class="w-full flex flex-col justify-between gap-4 p-1">
        <contact-address-head class="flex justify-between">
            <div class="flex items-center gap-2">
                <NetworkAvatar {networkId} />
                <Text type="body1">{getTitle()}</Text>
            </div>
            <ContactAddressMenu {drawerRouter} {networkId} />
        </contact-address-head>
        {#each Object.values(contactAddressMap) as contactAddress}
            <contact-address-item class="flex justify-between items-end gap-4">
                <div class="flex flex-col">
                    <Text width="full" align="left" truncate>
                        {contactAddress.addressName}
                    </Text>
                    <Copyable value={contactAddress.address}>
                        <Text type="pre-md" textColor="secondary" fontWeight="medium">
                            {truncateString(contactAddress.address, 9, 9)}
                        </Text>
                    </Copyable>
                </div>
                <div class="flex flex-row space-x-1">
                    {#if hasExplorer}
                        <IconButton
                            size="sm"
                            icon={IconName.Globe}
                            tooltip={localize('general.viewOnExplorer')}
                            on:click={() => onExplorerClick(contactAddress.address)}
                        />
                    {/if}
                    <IconButton
                        size="sm"
                        icon={IconName.QrCode}
                        tooltip={localize('general.viewQrCode')}
                        on:click={() => onQrCodeClick(contactAddress)}
                    />
                    {#if features.contacts.sendTo.enabled}
                        <IconButton
                            icon={IconName.Send}
                            tooltip={localize('actions.send')}
                            on:click={() => onSendClick(contactAddress.address)}
                        />
                    {/if}
                </div>
            </contact-address-item>
        {/each}
    </contact-address-card>
</Tile>
