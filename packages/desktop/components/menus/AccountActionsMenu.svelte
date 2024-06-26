<script lang="ts">
    import { IMenuItem, IconName, Menu } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { setNextSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { checkActiveProfileAuth, updateActiveAccountPersistedData } from '@core/profile/actions'
    import { activeAccounts, activeProfile, nonHiddenActiveAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    let menu: Menu | undefined = undefined

    $: account = $selectedAccount as IAccountState

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.CustomiseAccount })
        menu?.close()
    }

    function onShowAccountClick(): void {
        updateActiveAccountPersistedData(account.index, { hidden: false })
        menu?.close()
    }

    function onHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            updateActiveAccountPersistedData(account.index, { hidden: true })
            if (!$activeProfile.showHiddenAccounts) {
                setNextSelectedAccount()
            }
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
        menu?.close()
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                variant: 'danger',
                title: localize('popups.deleteAccount.title', { values: { name: account.name } }),
                alert: { variant: 'warning', text: localize('popups.deleteAccount.hint') },
                confirmText: localize('actions.delete'),
                onConfirm: async () => {
                    try {
                        await checkActiveProfileAuth()
                    } catch {
                        return
                    }

                    try {
                        await deleteAccount(account.index)
                        closePopup()
                    } catch (error) {
                        handleError(error)
                    }
                },
            },
        })
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(account: IAccountState, nonHiddenActiveAccounts: IAccountState[], showDelete: boolean): void {
        items = [
            {
                icon: IconName.SettingsSliders,
                title: localize('actions.customizeAccount'),
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
        account,
        $nonHiddenActiveAccounts,
        account.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1
    )
</script>

<account-actions-menu>
    <Menu bind:this={menu} {items} />
</account-actions-menu>
