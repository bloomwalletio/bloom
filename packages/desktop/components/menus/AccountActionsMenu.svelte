<script lang="ts">
    import { IMenuItem, IconName, Menu } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setNextSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { activeAccounts, activeProfile, nonHiddenActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    let menu: Menu | undefined = undefined

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
        menu?.close()
    }

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.ManageAccount })
        menu?.close()
    }

    function onShowAccountClick(): void {
        if ($selectedAccount) {
            updateActiveAccountPersistedData($selectedAccount.index, { hidden: false })
            menu?.close()
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
        menu?.close()
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.DeleteAccount,
            props: {
                account: selectedAccount,
                deleteAccount,
            },
        })
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(account: IAccountState, nonHiddenActiveAccounts: IAccountState[], showDelete: boolean) {
        items = [
            {
                icon: IconName.PieChart,
                title: localize('actions.viewBalanceBreakdown'),
                onClick: onViewBalanceClick,
            },
            {
                icon: IconName.Sliders,
                title: localize('actions.customizeAcount'),
                onClick: onCustomiseAccountClick,
            },
        ]
        if (account?.hidden) {
            items.push({
                icon: IconName.Eye,
                title: localize('actions.showAccount'),
                onClick: onShowAccountClick,
            })
        } else {
            items.push({
                icon: IconName.EyeOff,
                title: localize('actions.hideAccount'),
                onClick: onHideAccountClick,
                disabled: nonHiddenActiveAccounts.length <= 1,
            })
        }
        if (showDelete) {
            items.push({
                icon: IconName.Trash,
                title: localize('actions.deleteAccount'),
                variant: 'danger',
                onClick: onDeleteAccountClick,
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
    <Menu bind:this={menu} {items} />
</account-actions-menu>
