<script lang="ts">
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { getBaseToken } from '@core/profile/actions'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { AccountLabel, Modal, Text, TextType } from '@ui'
    import { fade } from 'svelte/transition'

    export let modal: Modal = undefined
    export let searchValue: string = ''
    export let selected: IAccountState = undefined
    export let showBalance: boolean = false
    export let includeSelectedAccount: boolean = false
    export let onClose: () => void

    $: accounts = $visibleActiveAccounts?.filter(
        (account) => account.index !== $selectedAccount.index || includeSelectedAccount
    )
    $: filteredAccounts = accounts?.filter(
        (account) =>
            account.name.toLowerCase().includes(searchValue?.toLowerCase() ?? '') ||
            account.depositAddress.toLowerCase().includes(searchValue?.toLowerCase() ?? '')
    )

    function getSuffixForAccount(account: IAccountState): string {
        return showBalance
            ? formatTokenAmountBestMatch(Number(account.balances.baseCoin.available), getBaseToken())
            : truncateString(account?.depositAddress, 10, 10)
    }

    function onClick(_selected: IAccountState): void {
        modal?.close()
        selected = _selected
    }
</script>

{#if filteredAccounts?.length > 0}
    <Modal bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4" on:close={onClose}>
        <recipient-account-picker-modal
            class="max-h-64 flex flex-col space-y-1 scrollable-y"
            in:fade={{ duration: 100 }}
        >
            {#each filteredAccounts as account}
                <button
                    on:click={() => onClick(account)}
                    class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                >
                    <AccountLabel {account} />
                    <Text type={TextType.pre} fontSize="sm" color="gray-600">{getSuffixForAccount(account)}</Text>
                </button>
            {/each}
        </recipient-account-picker-modal>
    </Modal>
{/if}
