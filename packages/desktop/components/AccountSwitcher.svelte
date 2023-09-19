<script lang="ts">
    import { IMenuItem, Indicator, Menu, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { activeProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { selectedAccountTokens } from '@core/token/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

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
    placement="bottom-start"
    compact={false}
    button={{
        text: localize('general.newAccount'),
        onClick: onCreateAccountClick,
    }}
>
    <button
        slot="anchor"
        type="button"
        class="flex flex-row justify-center items-center space-x-2 px-1.5 rounded-md cursor-pointer"
    >
        <Indicator color={$selectedAccount?.color} size="sm" />
        <Text size="sm" weight="semibold" color="#1E1B4E">
            {$selectedAccount?.name}
        </Text>
    </button>
</Menu>

<style lang="scss">
    button:hover {
        @apply bg-purple-100;
    }
</style>
