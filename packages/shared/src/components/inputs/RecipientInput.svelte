<script lang="ts">
    import { Modal, SelectorInput, IOption, ColoredCircle } from '@ui'
    import { getRandomAccountColor } from '@core/account/utils'
    import { localize } from '@core/i18n'
    import { Layer1RecipientError } from '@core/layer-2/errors'
    import { getNetworkHrp } from '@core/profile/actions'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
    import { SubjectType } from '@core/wallet'
    import { Subject } from '@core/wallet/types'
    import { getSubjectFromAddress } from '@core/wallet/utils'

    export let recipient: Subject | undefined
    export let options: IOption[]
    export let disabled = false
    export let isLayer2 = false

    let inputElement: HTMLInputElement | undefined = undefined
    let modal: Modal | undefined = undefined

    let error: string
    let selected: IOption =
        recipient?.type === SubjectType.Account
            ? { key: recipient.account.name, value: recipient.account.depositAddress }
            : { value: recipient?.address }

    $: isLayer2, (error = '')
    $: recipient = getSubjectFromAddress(selected?.value)

    export function validate(): void {
        try {
            if (recipient?.type === SubjectType.Address || recipient?.type === SubjectType.Contact) {
                if (!recipient.address) {
                    throw new Error(localize('error.send.recipientRequired'))
                }

                if (isLayer2) {
                    validateEthereumAddress(recipient?.address)
                } else {
                    validateBech32Address(getNetworkHrp(), recipient?.address)
                }
            } else if (recipient?.type === SubjectType.Account) {
                if (isLayer2) {
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
    <ColoredCircle color={getRecipientColor(option)} />
</SelectorInput>
