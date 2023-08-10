<script lang="ts">
    import { Button, FlatIconName } from '@bloomwalletio/ui'
    import { sumBalanceForAccounts } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile, getBaseToken, visibleActiveAccounts } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { AccountSwitcherMenuItem, FontWeight, Modal, Text, TextType } from '@ui'
    import { tick } from 'svelte'

    export let modal: Modal = undefined

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)
    $: ({ baseCoin } = $selectedAccountAssets[$activeProfile?.network.id])

    async function scrollToSelectedAccount(): Promise<void> {
        await tick()
        const element = document.getElementById(`account-${$selectedAccount.index}`)
        element?.scrollIntoView({ behavior: 'auto' })
    }

    function onCreateAccountClick(): void {
        modal?.close()
        openPopup({ id: PopupId.CreateAccount })
    }
</script>

<Modal
    bind:this={modal}
    on:open={scrollToSelectedAccount}
    classes="transform -translate-x-1/2"
    size="large"
    position={{ top: '30px', left: '50%' }}
>
    <account-list-container class="block p-4">
        <account-list class="flex flex-col space-y-1 max-h-96 scrollable-y">
            {#each $visibleActiveAccounts as account}
                <AccountSwitcherMenuItem id="account-{account.index}" {account} onClick={modal?.close} />
            {/each}
        </account-list>
    </account-list-container>
    <hr />
    <button
        type="button"
        class=" flex flex-row justify-between w-full p-8 hover:bg-gray-50 dark:hover:bg-gray-800"
        on:click={onCreateAccountClick}
    >
        <Button icon={FlatIconName.Plus} variant="text" text={localize('general.addAWallet')} />
        <div class="flex flex-col items-end text-right space-y-1">
            <Text type={TextType.h5}>
                {formatTokenAmountBestMatch(totalBalance, getBaseToken())}
            </Text>
            <Text fontSize="12" fontWeight={FontWeight.semibold} lineHeight="20" color="blue-500">
                {formatCurrency(getMarketAmountFromAssetValue(totalBalance, baseCoin))}
            </Text>
        </div>
    </button>
</Modal>
