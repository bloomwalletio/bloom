<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { NetworkId } from '@core/network'
    import { SubjectType } from '@core/wallet'
    import { FontWeight, Icon, IOption, NetworkIcon, RecipientInput, Text, TextType } from '@ui'
    import { INetworkRecipientSelectorOption } from '../interfaces'

    export let item: INetworkRecipientSelectorOption
    export let selected: boolean = false
    export let onClick: (item: INetworkRecipientSelectorOption) => void = () => {}
    export let onChange: (item: INetworkRecipientSelectorOption) => void = () => {}

    let recipientInputElement: HTMLInputElement

    let isLayer2
    $: isLayer2 = !!item?.networkAddress
    $: onChange && selected && onChange(item)

    const options = getOptionsFromItem(item)

    function getOptionsFromItem(item: INetworkRecipientSelectorOption): IOption[] {
        return item?.recipients?.map((r) => {
            switch (r.type) {
                case SubjectType.Account:
                    return {
                        id: r.account.index,
                        key: r.account.name,
                        value: r.account.depositAddress,
                        color: r.account.color,
                    }
                case SubjectType.Contact:
                    return {
                        id: r.contact.id,
                        key: r.contact.name,
                        value: r.address,
                        color: r.contact.color,
                    }
            }
        })
    }

    function onItemClick(): void {
        recipientInputElement?.focus()
        onClick && onClick(item)
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<network-recipient-item class:selected class:disabled={item?.disabled} on:click={onItemClick}>
    <network-recipient-item-name>
        <div class="flex flex-row justify-between items-center space-x-4">
            <div class="flex flex-row space-x-3 items-center">
                <NetworkIcon networkId={NetworkId.Testnet} />
                <Text type={TextType.h4} fontWeight={FontWeight.semibold}>
                    {item?.name}
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
                bind:inputElement={recipientInputElement}
                bind:recipient={item.selectedRecipient}
                {options}
                {isLayer2}
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
