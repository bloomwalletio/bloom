<script lang="ts">
    import { ContactBookRoute } from '../contact-book-route.enum'

    import { Button, NetworkInput, TextInput, HR } from '@ui'
    import { DrawerTemplate } from '@components'

    import { ContactManager } from '@core/contact'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DestinationNetwork } from '@core/layer-2'
    import { isValidBech32AddressAndPrefix, validateEthereumAddress } from '@core/utils'
    import { getActiveProfilePersistedAccountData, getNetworkHrp } from '@core/profile'
    import { selectedAccount, selectedAccountIndex } from '@core/account'
    import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network'
    import { getActiveNetworkId } from '@core/network/utils/getNetworkId'

    export let drawerRouter: Router<unknown>

    let name: string = ''
    let nameError: string = ''
    let note: string = ''
    let noteError: string = ''
    let address: string = ''
    let addressError: string = ''
    let addressName: string = ''
    let addressNameError: string = ''
    let networkSelection: { networkId: string; address?: string } | undefined
    let networkSelectionError: string = ''

    function onSaveClick(): void {
        const contact = { name, note }
        const networkAddress = { networkId: networkSelection?.networkId, addressName, address }

        if (validate()) {
            ContactManager.addContact(contact, networkAddress)
            drawerRouter.previous()
        }
    }

    function validate(): boolean {
        validateName()
        validateNote()
        validateNetworkSelection()
        validateAddress()
        validateAddressName()

        return !(nameError || noteError || addressError || addressNameError || networkSelectionError)
    }

    const CONTACT_NAME_MAX_LENGTH: number = 32

    function validateName(): void {
        if (!name) {
            nameError = 'Invalid name input'
        }

        if (name.length > CONTACT_NAME_MAX_LENGTH) {
            nameError = 'Name too long'
        }
    }

    const CONTACT_NOTE_MAX_LENGTH: number = 256

    function validateNote(): void {
        if (!note) {
            noteError = 'Invalid note input'
        }

        if (note.length > CONTACT_NOTE_MAX_LENGTH) {
            noteError = 'Note too long'
        }
    }

    function validateAddress(): void {
        if (!address) {
            addressError = 'Invalid address input'
        }

        switch (networkSelection?.networkId) {
            case DestinationNetwork.Shimmer:
            case DestinationNetwork.Testnet:
                if (!isValidBech32AddressAndPrefix(address, getNetworkHrp())) {
                    addressError = 'Invalid Bech32 format'
                }
                if (address === getActiveProfilePersistedAccountData($selectedAccountIndex)?.depositAddress) {
                    /* eslint-disable quotes */
                    addressError = `Cannot be this account's address`
                }
                if (
                    ContactManager.listContactAddressesForNetwork(networkSelection.networkId)
                        .map((contactAddress) => contactAddress.address)
                        .includes(address)
                ) {
                    addressError = 'Address already being used'
                }
                break
            case DestinationNetwork.ShimmerEvm:
            case DestinationNetwork.ShimmerEvmTestnet: {
                try {
                    validateEthereumAddress(address)
                } catch (err) {
                    addressError = err.message ?? err
                }
                const coinType = DEFAULT_CHAIN_CONFIGURATIONS[getActiveNetworkId()]?.coinType
                if (address === $selectedAccount.evmAddresses[coinType]) {
                    /* eslint-disable quotes */
                    addressError = `Cannot be this account's address`
                }

                if (
                    ContactManager.listContactAddressesForNetwork(networkSelection.networkId)
                        .map((contactAddress) => contactAddress.address)
                        .includes(address)
                ) {
                    addressError = 'Address already being used'
                }
                break
            }
        }
    }

    function validateAddressName(): void {
        if (!addressName) {
            addressNameError = 'Invalid address name input'
        }

        if (addressName.length > CONTACT_NAME_MAX_LENGTH) {
            addressNameError = 'Address name too long'
        }

        /**
         * NOTE: We do not need to validate that the name is unique and not being used b/c the user
         * is adding a contact for the first time when they are in this drawer.
         */
    }

    function validateNetworkSelection(): void {
        if (!networkSelection || !Object.values(DestinationNetwork).includes(networkSelection?.networkId)) {
            networkSelectionError = 'Invalid network selection input'
        }
    }
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.AddContact}.title`)}
    {drawerRouter}
>
    <add-contact class="flex flex-col gap-4">
        <TextInput
            bind:value={name}
            bind:error={nameError}
            placeholder={localize('general.name')}
            label={localize('general.name')}
        />
        <TextInput
            bind:value={note}
            bind:error={noteError}
            placeholder={localize('general.note')}
            label={localize('general.note')}
        />
        <HR />
        <NetworkInput bind:networkSelection bind:error={networkSelectionError} showLayer2={true} />
        <TextInput
            bind:value={addressName}
            bind:error={addressNameError}
            placeholder={localize('general.addressName')}
            label={localize('general.addressName')}
        />
        <TextInput
            bind:value={address}
            bind:error={addressError}
            placeholder={localize('general.address')}
            label={localize('general.address')}
        />
    </add-contact>
    <div slot="footer">
        <Button onClick={onSaveClick} classes="w-full">{localize('actions.save')}</Button>
    </div>
</DrawerTemplate>
