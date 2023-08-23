<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { isEvmChain } from '@core/network'
    import { Subject, SubjectType } from '@core/wallet'
    import { FontWeight, Icon, IOption, NetworkIcon, RecipientInput, Text, TextType } from '@ui'
    import { INetworkRecipientSelectorOption } from '../interfaces'

    export let item: INetworkRecipientSelectorOption
    export let selected: boolean = false
    export let onClick: (item: INetworkRecipientSelectorOption) => void = () => {}
    export let onChange: (item: INetworkRecipientSelectorOption) => void = () => {}

    let recipientInput: RecipientInput

    export function validate(): void {
        recipientInput?.validate()
    }

    let recipientInputElement: HTMLInputElement

    $: onChange && selected && onChange(item)

    const options = item.recipients?.map((r) => getOptionFromRecipient(r)).filter((r) => !!r) as IOption[]

    function getOptionFromRecipient(recipient: Subject): IOption | undefined {
        switch (recipient.type) {
            case SubjectType.Account:
                return {
                    id: recipient.account.index,
                    key: recipient.account.name,
                    value: recipient.address,
                    color: recipient.account.color,
                }
            case SubjectType.Contact:
                return {
                    id: recipient.contact.id,
                    key: recipient.contact.name,
                    value: recipient.address,
                    color: recipient.contact.color,
                }
            default:
                return undefined
        }
    }

    function onItemClick(): void {
        recipientInputElement?.focus()
        onClick && onClick(item)
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<network-recipient-item class:selected class:disabled={item.disabled} on:click={onItemClick}>
    <network-recipient-item-name>
        <div class="flex flex-row justify-between items-center space-x-4">
            <div class="flex flex-row space-x-3 items-center">
                <NetworkIcon networkId={item.networkId} />
                <Text type={TextType.h4} fontWeight={FontWeight.semibold}>
                    {item.name}
                </Text>
            </div>
            {#if selected}
                <network-recipient-item-checkbox>
                    <Icon icon={IconEnum.CheckboxRound} width={16} height={16} classes="active" />
                </network-recipient-item-checkbox>
            {/if}
        </div>
    </network-recipient-item-name>
    {#if selected}
        <network-recipient-item-address>
            <RecipientInput
                bind:this={recipientInput}
                bind:inputElement={recipientInputElement}
                bind:recipient={item.selectedRecipient}
                {options}
                networkId={item.networkId}
                isEvmChain={isEvmChain(item.networkId)}
            />
        </network-recipient-item-address>
    {/if}
</network-recipient-item>

<style lang="scss">
    network-recipient-item {
        @apply w-full relative cursor-pointer;
        @apply p-4;
        @apply rounded-10;
        @apply flex flex-col space-y-4;
        @apply rounded-10 border-solid border border-gray-300;
        &.selected {
            @apply border-2 border-blue-500;
        }
        &.disabled {
            @apply pointer-events-none;
            @apply opacity-50;
            @apply cursor-not-allowed;
        }
    }
    :global(network-recipient-item-checkbox svg.active path) {
        @apply text-blue-500;
        @apply fill-current;
    }
</style>
