<script lang="ts">
    import { IAccountState } from '@core/account'
    import { setSelectedAccount } from '@core/account/actions'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { AccountLabel } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { Table } from '@bloomwalletio/ui'

    export const onCancel: () => void = () => {}
    export let onConfirm: () => void
    export let account: IAccountState

    function onConfirmClick(): void {
        setSelectedAccount(account.index)
        onConfirm()
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
    }
</script>

<PopupTemplate
    title={localize('popups.dappAccountSwitcher.title')}
    description={localize('popups.dappAccountSwitcher.body')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
    }}
>
    <Table
        items={[
            {
                key: localize('general.account'),
                slot: {
                    component: AccountLabel,
                    props: {
                        account,
                    },
                },
            },
        ]}
    />
</PopupTemplate>
