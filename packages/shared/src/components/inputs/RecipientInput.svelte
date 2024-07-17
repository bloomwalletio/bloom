<script lang="ts">
    import { getRandomAccountColor } from '@core/account/utils'
    import { localize } from '@core/i18n'
    import { getNetworkHrp } from '@core/profile/actions'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
    import { SubjectType } from '@core/wallet'
    import { Subject } from '@core/wallet/types'
    import { getSubjectFromAddress } from '@core/wallet/utils'
    import { Indicator, IOption, SelectInput } from '@bloomwalletio/ui'
    import { NetworkId } from '@core/network'
    import { ContactManager } from '@core/contact/classes'

    export let recipient: Subject | undefined
    export let options: IOption[]
    export let networkId: NetworkId
    export let disabled = false
    export let isEvmNetwork = false

    let value: any
    let error: string
    let selected: IOption = getSelectedRecipient(recipient)

    $: isEvmNetwork, (error = '')
    function updateRecipientIfValueChanges() {
        recipient = getSubjectFromAddress(value, networkId)
    }
    $: value, updateRecipientIfValueChanges()

    function updateValueIfRecipientPassedIn() {
        if (recipient?.address !== value) {
            value = recipient?.address
            selected = getSelectedRecipient(recipient)
        }
    }
    $: recipient, updateValueIfRecipientPassedIn()

    export function validate(): void {
        try {
            if (recipient && recipient.address) {
                if (isEvmNetwork) {
                    validateEthereumAddress(recipient?.address)
                } else {
                    validateBech32Address(getNetworkHrp(), recipient?.address)
                }
            } else {
                throw new Error(localize('error.send.recipientRequired'))
            }
        } catch (err) {
            error = err?.message ?? err
            throw err
        }
    }

    export function getAccountColor(name: string | undefined): string | undefined {
        return $visibleActiveAccounts?.find((account) => account.name === name)?.color
    }

    function getSelectedRecipient(recipient: Subject | undefined): IOption {
        if (recipient) {
            switch (recipient.type) {
                case SubjectType.Account: {
                    const label = recipient.account.name
                    return { label, value: recipient.address, color: getAccountColor(label) }
                }
                case SubjectType.Network:
                case SubjectType.Address:
                case SubjectType.SmartContract:
                    return { value: recipient.address, color: getRandomAccountColor() }
                case SubjectType.Contact: {
                    const address = ContactManager.getNetworkContactAddressMapForContact(recipient.contact.id)?.[
                        networkId
                    ]?.[recipient.address]
                    return {
                        label: recipient.contact.name,
                        value: recipient.address,
                        color: recipient.contact.color,
                        ...(address && { displayedValue: address.addressName }),
                    }
                }
            }
        } else {
            return {
                value: undefined,
            }
        }
    }
</script>

<SelectInput
    label={localize('general.recipient')}
    bind:value
    bind:error
    searchable
    {selected}
    {disabled}
    {options}
    {...$$restProps}
    customValue={true}
    let:color
>
    <Indicator {color} size="sm" />
</SelectInput>
