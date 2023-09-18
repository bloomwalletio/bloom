<script lang="ts">
    import { IMenuItem, Menu } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setNextSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { activeAccounts, activeProfile, nonHiddenActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
    }

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.ManageAccount })
    }

    function onShowAccountClick(): void {
        if ($selectedAccount) {
            updateActiveAccountPersistedData($selectedAccount.index, { hidden: false })
        }
    }

    function onHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            if ($selectedAccount) {
                updateActiveAccountPersistedData($selectedAccount.index, { hidden: true })
                if (!$activeProfile.showHiddenAccounts) {
                    setNextSelectedAccount()
                }
            }
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.DeleteAccount,
            props: {
                account: selectedAccount,
                deleteAccount,
            },
        })
    }

    let items: IMenuItem[] = []
    function setItems(account: IAccountState, nonHiddenActiveAccounts: IAccountState[], showDelete: boolean) {
        items = [
            {
                text: localize('actions.viewBalanceBreakdown'),
                onClick: onViewBalanceClick,
            },
            {
                text: localize('actions.customizeAcount'),
                onClick: onCustomiseAccountClick,
            },
        ]
        if (account?.hidden) {
            items.push({
                text: localize('actions.showAccount'),
                onClick: onShowAccountClick,
            })
        } else {
            items.push({
                text: localize('actions.hideAccount'),
                onClick: onHideAccountClick,
                disabled: nonHiddenActiveAccounts.length <= 1,
            })
        }
        if (showDelete) {
            items.push({
                text: localize('actions.deleteAccount'),
                onClick: onDeleteAccountClick,
                variant: 'danger',
            })
        }
    }
    $: setItems(
        $selectedAccount,
        $nonHiddenActiveAccounts,
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1
    )
</script>

<account-actions-menu>
    <Menu {items} />
</account-actions-menu>
