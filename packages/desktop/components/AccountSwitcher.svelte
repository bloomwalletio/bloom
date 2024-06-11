<script lang="ts">
    import { Breadcrumb, IMenuItem, Icon, IconName, Indicator, Menu, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { allAccountFiatBalances } from '@core/token/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    export let breadcrumb: boolean = false
    export let hasCreateAccount: boolean = false
    export let placement: 'bottom-start' | 'bottom-end' = 'bottom-start'

    const menu: Menu | undefined = undefined

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(accounts: IAccountState[], selectedIndex: number | undefined): void {
        items = accounts.map((account): IMenuItem => {
            return {
                title: account.name,
                subtitle: formatCurrency($allAccountFiatBalances[account.index]),
                selected: selectedIndex === account.index,
                onClick: () => onAccountClick(account.index),
            }
        })

        const totalBalance = Object.values($allAccountFiatBalances)
            .reduce((acc, balance) => Number(acc) + Number(balance), 0)
            .toString()

        items = items.concat({
            title: localize('general.totalBalance'),
            subtitle: formatCurrency(totalBalance),
            selected: false,
            hidden: accounts.length < 2,
        })
    }

    $: setItems($visibleActiveAccounts, $selectedAccount?.index)

    function onCreateAccountClick(): void {
        openPopup({ id: PopupId.CreateAccount })
        menu?.close()
    }
</script>

<Menu
    {items}
    compact={false}
    {...hasCreateAccount && { button: { text: localize('general.newAccount'), onClick: onCreateAccountClick } }}
    {placement}
    maxHeight={320}
>
    <Breadcrumb slot="anchor" tooltip={breadcrumb ? localize('actions.switchAccount') : undefined}>
        <div class="flex flex-row justify-center items-center space-x-2">
            {#if breadcrumb}
                <Indicator color={$selectedAccount?.color} size="sm" />
            {/if}
            <div class="flex flex-row justify-center items-center {breadcrumb ? 'space-x-1' : 'space-x-2'}">
                <Text type={breadcrumb ? 'base' : 'body1'}>
                    {$selectedAccount?.name}
                </Text>
                {#if !breadcrumb}
                    <Icon name={IconName.ChevronSelectorVertical} size="sm" textColor="secondary" />
                {/if}
            </div>
        </div>
    </Breadcrumb>
</Menu>
