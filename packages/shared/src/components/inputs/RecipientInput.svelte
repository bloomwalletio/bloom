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
    export let isEvmChain = false

    let error: string
    let selected: IOption = getSelectedRecipient(recipient)

    $: isEvmChain, (error = '')
    $: recipient = selected?.value ? getSubjectFromAddress(selected.value, networkId) : undefined

    export function validate(): void {
        try {
            if (recipient && recipient.address) {
                if (isEvmChain) {
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
                case SubjectType.Account:
                    return { label: recipient.account.name, value: recipient.address }
                case SubjectType.Address:
                    return { value: recipient.address }
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

    function getRecipientColor(option: IOption): string {
        return option.color ?? getAccountColor(option?.label) ?? getRandomAccountColor()
    }
</script>

<SelectInput
    label={localize('general.recipient')}
    bind:selected
    bind:error
    {disabled}
    {options}
    {...$$restProps}
    customValue={true}
    let:option
>
    <Indicator color={getRecipientColor(option)} />
</SelectInput>
