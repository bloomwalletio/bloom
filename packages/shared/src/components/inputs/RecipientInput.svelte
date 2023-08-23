<script lang="ts">
    import { Modal, SelectorInput, IOption } from '@ui'
    import { getRandomAccountColor } from '@core/account/utils'
    import { localize } from '@core/i18n'
    import { Layer1RecipientError } from '@core/layer-2/errors'
    import { getNetworkHrp } from '@core/profile/actions'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
    import { SubjectType } from '@core/wallet'
    import { Subject } from '@core/wallet/types'
    import { getSubjectFromAddress } from '@core/wallet/utils'
    import { Indicator } from '@bloomwalletio/ui'

    export let recipient: Subject | undefined
    export let options: IOption[]
    export let disabled = false
    export let isEvmChain = false

    let inputElement: HTMLInputElement | undefined = undefined
    let modal: Modal | undefined = undefined

    let error: string
    let selected: IOption =
        recipient?.type === SubjectType.Account
            ? { key: recipient.account.name, value: recipient.address }
            : recipient?.type === SubjectType.Contact
            ? { key: recipient.contact.name, value: recipient.address }
            : { value: recipient?.address }

    $: isEvmChain, (error = '')
    $: recipient = getSubjectFromAddress(selected?.value)

    export function validate(): void {
        try {
            if (recipient?.type === SubjectType.Address || recipient?.type === SubjectType.Contact) {
                if (!recipient.address) {
                    throw new Error(localize('error.send.recipientRequired'))
                }

                if (isEvmChain) {
                    validateEthereumAddress(recipient?.address)
                } else {
                    validateBech32Address(getNetworkHrp(), recipient?.address)
                }
            } else if (recipient?.type === SubjectType.Account) {
                if (isEvmChain) {
                    throw new Layer1RecipientError()
                }
            } else {
                throw new Error(localize('error.send.recipientRequired'))
            }
        } catch (err) {
            error = err?.message ?? err
            throw err
        }
    }

    export function getAccountColorById(id: number): string | undefined {
        return $visibleActiveAccounts?.find((account) => account.index === id)?.color
    }

    function getRecipientColor(option: IOption): string {
        return option.color ?? getAccountColorById(option?.id) ?? getRandomAccountColor()
    }
</script>

<SelectorInput
    labelLocale="general.recipient"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    {disabled}
    {options}
    maxHeight="max-h-48"
    {...$$restProps}
    let:option
>
    <Indicator color={getRecipientColor(option)} />
</SelectorInput>
