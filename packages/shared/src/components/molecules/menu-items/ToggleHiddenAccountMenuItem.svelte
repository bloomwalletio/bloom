<script lang="ts">
    import { MenuItem } from '@ui'
    import { setNextSelectedAccount } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { activeProfile, nonHiddenActiveAccounts } from '@core/profile/stores'
    import { Icon } from '@lib/auxiliary/icon'

    export let onClick: () => unknown

    function onShowAccountClick(): void {
        if ($selectedAccount) {
            updateActiveAccountPersistedData($selectedAccount.index, { hidden: false })
            onClick && onClick()
        }
    }

    function onHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            if ($selectedAccount) {
                updateActiveAccountPersistedData($selectedAccount.index, { hidden: true })
                if (!$activeProfile.showHiddenAccounts) {
                    setNextSelectedAccount()
                }
                onClick && onClick()
            }
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }
</script>

{#if $selectedAccount}
    <MenuItem
        icon={$selectedAccount.hidden ? Icon.View : Icon.Hide}
        title={localize($selectedAccount.hidden ? 'actions.showAccount' : 'actions.hideAccount')}
        onClick={() => ($selectedAccount.hidden ? onShowAccountClick() : onHideAccountClick())}
        disabled={!$selectedAccount.hidden && $nonHiddenActiveAccounts.length <= 1}
        {...$$restProps}
    />
{/if}
