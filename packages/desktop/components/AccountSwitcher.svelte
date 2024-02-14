<script lang="ts">
    import { Breadcrumb, IMenuItem, Icon, IconName, Indicator, Menu, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { allAccountFiatBalances } from '@core/token/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    export let navbar: boolean = false
    export let placement: 'bottom-start' | 'bottom-end' = 'bottom-start'

    const menu: Menu | undefined = undefined

    function onAccountClick(accountIndex: number): void {
        setSelectedAccount(accountIndex)
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(accounts: IAccountState[], selectedIndex) {
        items = accounts.map((account) => {
            return {
                title: account.name,
                subtitle: formatCurrency($allAccountFiatBalances[account.index]),
                selected: selectedIndex === account.index,
                onClick: () => onAccountClick(account.index),
            }
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
    compact={navbar}
    {...!navbar && { button: { text: localize('general.newAccount'), onClick: onCreateAccountClick } }}
    {placement}
    class="max-h-80 overflow-auto"
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
