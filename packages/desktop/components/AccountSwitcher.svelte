<script lang="ts">
    import { Icon, IconName, IMenuItem, Indicator, Menu, Text } from '@bloomwalletio/ui'
    import { formatCurrency, localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { selectedAccountTokens } from '@core/token/stores'
    import { activeProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { setSelectedAccount } from '@core/account/actions'
    import { IAccountState } from '@core/account'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { selectedAccount } from '@core/account/stores'

    export let navbar: boolean = false

    const menu: Menu | undefined = undefined

    $: baseCoin = $selectedAccountTokens[$activeProfile?.network?.id]?.baseCoin

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(accounts: IAccountState[], selectedIndex) {
        items = accounts.map((account) => {
            return {
                title: account.name,
                subtitle: formatCurrency(
                    getMarketAmountFromTokenValue(Number(account.balances.baseCoin.total), baseCoin)
                ),
                selected: selectedIndex === account.index,
                onClick: () => onAccountClick(account.index),
            }
        })
    }
    $: setItems($visibleActiveAccounts, $selectedAccount.index)

    function onCreateAccountClick(): void {
        openPopup({ id: PopupId.CreateAccount })
        menu?.close()
    }
</script>

<Menu
    {items}
    compact={navbar}
    {...!navbar && { button: { text: localize('general.newAccount'), onClick: onCreateAccountClick } }}
    placement="bottom-start"
>
    <button
        slot="anchor"
        type="button"
        class="flex flex-row justify-center items-center space-x-2 px-1 rounded cursor-pointer"
    >
        {#if navbar}
            <Indicator color={$selectedAccount?.color} size="sm" />
        {/if}
        <Text type={navbar ? 'base' : 'body1'}>
            {$selectedAccount?.name}
        </Text>
        {#if !navbar}
            <Icon name={IconName.ChevronSelectorVertical} size="sm" color="text-secondary" />
        {/if}
    </button>
</Menu>

<style lang="scss">
    button:hover {
        @apply bg-surface-2;
    }
</style>
