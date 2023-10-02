<script lang="ts">
    import { Icon, IconName, IMenuItem, Indicator, Menu, Text, Breadcrumb } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { activeProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { selectedAccountTokens } from '@core/token/stores'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

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
    <Breadcrumb slot="anchor" tooltip={navbar ? localize('actions.switchAccount') : undefined}>
        <div class="flex flex-row justify-center items-center space-x-2">
            {#if navbar}
                <Indicator color={$selectedAccount?.color} size="sm" />
            {/if}
            <Text type={navbar ? 'base' : 'body1'}>
                {$selectedAccount?.name}
            </Text>
            {#if !navbar}
                <Icon name={IconName.ChevronSelectorVertical} size="sm" textColor="secondary" />
            {/if}
        </div>
    </Breadcrumb>
</Menu>

<style lang="scss">
    button:hover {
        @apply bg-surface-2 dark:bg-surface-2-dark;
    }
</style>
