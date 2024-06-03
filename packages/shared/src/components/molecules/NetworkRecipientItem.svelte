<script lang="ts">
    import { Icon, IOption, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { SupportedNetworkId, isEvmNetwork } from '@core/network'
    import { Subject, SubjectType } from '@core/wallet'
    import { NetworkAvatar, RecipientInput } from '@ui'
    import { INetworkRecipientSelectorOption } from '../interfaces'
    import { ContactManager } from '@core/contact'

    export let item: INetworkRecipientSelectorOption
    export let selected: boolean = false
    export let hasError: boolean = false
    export let onClick: (item: INetworkRecipientSelectorOption) => void = () => {}
    export let onChange: (item: INetworkRecipientSelectorOption) => void = () => {}

    let recipientInput: RecipientInput

    export function validate(): void {
        recipientInput?.validate()
    }

    let recipientInputElement: HTMLInputElement

    $: onChange && selected && onChange(item)

    const options = item.recipients?.flatMap((r) => getOptionFromRecipient(r))

    function getOptionFromRecipient(recipient: Subject): IOption[] {
        switch (recipient.type) {
            case SubjectType.Account:
                return [
                    {
                        label: recipient.account.name,
                        value: recipient.address,
                        color: recipient.account.color,
                    },
                ]
            case SubjectType.Contact: {
                const networkId = isEvmNetwork(item.networkId) ? SupportedNetworkId.GenericEvm : item.networkId
                const addresses = Object.values(
                    ContactManager.getNetworkContactAddressMapForContact(recipient.contact.id)[networkId] ?? {}
                )
                return addresses.map<IOption>((address) => ({
                    label: `${recipient.contact.name} (${address.addressName})`,
                    value: address.address,
                    displayedValue: address.addressName,
                    color: recipient.contact.color,
                }))
            }
            default:
                return []
        }
    }

    function onItemClick(): void {
        recipientInputElement?.focus()
        onClick && onClick(item)
    }
</script>

<Tile
    surface={1}
    border
    selected={selected && !hasError}
    disabled={item.disabled || hasError}
    error={hasError}
    onClick={onItemClick}
>
    <div class="flex flex-col w-full space-y-4 justify-between">
        <network-recipient-item-name>
            <div class="flex flex-row justify-between items-center space-x-4">
                <div class="flex flex-row space-x-3 items-center">
                    <NetworkAvatar networkId={item.networkId} />
                    <Text type="body2">
                        {item.name}
                    </Text>
                </div>
                {#if selected}
                    <Icon name={IconName.SuccessCircle} size="sm" customColor="primary" />
                {/if}
            </div>
        </network-recipient-item-name>
        {#if selected}
            <network-recipient-item-address>
                <RecipientInput
                    bind:this={recipientInput}
                    bind:inputElement={recipientInputElement}
                    bind:recipient={item.selectedRecipient}
                    disabled={!selected}
                    {options}
                    networkId={item.networkId}
                    isEvmNetwork={isEvmNetwork(item.networkId)}
                />
            </network-recipient-item-address>
        {/if}
    </div>
</Tile>
