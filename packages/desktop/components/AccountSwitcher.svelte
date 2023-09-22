<script lang="ts">
    import { IconButton, IconName, IMenuItem, Indicator, Menu, Text } from '@bloomwalletio/ui'
    import { formatCurrency, localize } from '@core/i18n'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { selectedAccountTokens } from '@core/token/stores'
    import { activeProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { setSelectedAccount } from '@core/account/actions'
    import { IAccountState } from '@core/account'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { selectedAccount } from '@core/account/stores'

    export let hasAccountName: boolean = true
    export let isCompactMenu: boolean = false
    export let canCreateAccount: boolean = false

    const menu: Menu | undefined = undefined

    $: baseCoin = $selectedAccountTokens[$activeProfile?.network?.id]?.baseCoin

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(accounts: IAccountState[], selectedIndex) {
        items = accounts.map((account) => {
            const subtitle = formatCurrency(
                getMarketAmountFromTokenValue(Number(account.balances.baseCoin.total), baseCoin)
            )
            return {
                title: account.name,
                selected: selectedIndex === account.index,
                onClick: () => onAccountClick(account.index),
                ...(!isCompactMenu && { subtitle }),
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
    compact={isCompactMenu}
    {...canCreateAccount && { button: { text: localize('general.newAccount'), onClick: onCreateAccountClick } }}
>
    <div slot="anchor" class="flex items-center">
        {#if hasAccountName}
            <button
                type="button"
                class="flex flex-row justify-center items-center space-x-2 px-1.5 rounded-md cursor-pointer"
            >
                <Indicator color={$selectedAccount?.color} size="sm" />
                <Text type="body2">
                    {$selectedAccount?.name}
                </Text>
            </button>
        {:else}
            <IconButton icon={IconName.ChevronSelectorVertical} />
        {/if}
    </div>
</Menu>

<style lang="scss">
    button:hover {
        @apply bg-purple-100;
    }
</style>
