<script lang="ts">
    import { IAccountState } from '@core/account'
    import { setSelectedAccount } from '@core/account/actions'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { AccountInput } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let onCancel: () => void
    export let onConfirm: () => void

    let account: IAccountState

    function onConfirmClick(): void {
        setSelectedAccount(account.index)
        onConfirm && onConfirm()
    }

    function onCancelClick(): void {
        closePopup()
        onCancel && onCancel()
    }
</script>

<PopupTemplate
    title={localize('popups.deeplinkAccountSwitch.title')}
    description={localize('popups.deeplinkAccountSwitch.body')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
    }}
>
    <AccountInput bind:account />
</PopupTemplate>
