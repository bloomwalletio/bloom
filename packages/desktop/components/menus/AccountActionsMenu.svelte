<script lang="ts">
    import { MeatballMenuButton, MenuItem, Modal, ToggleHiddenAccountMenuItem } from '@ui'
    import { Icon } from '@auxiliary/icon/enums'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    let modal: Modal = undefined

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.ManageAccount })
        modal?.close()
    }

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
        modal?.close()
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.DeleteAccount,
            props: {
                account: selectedAccount,
                deleteAccount,
            },
        })
        modal?.close()
    }
</script>

<account-actions-menu class="relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <Modal bind:this={modal} {...$$restProps} position={{ right: '0' }}>
        <account-actions-menu class="flex flex-col">
            <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={onViewBalanceClick} />
            <MenuItem
                icon={Icon.Customize}
                title={localize('actions.customizeAcount')}
                onClick={onCustomiseAccountClick}
            />
            <ToggleHiddenAccountMenuItem onClick={modal?.close} />
            <hr />
            {#if showDeleteAccount}
                <MenuItem
                    icon={Icon.Delete}
                    title={localize('actions.deleteAccount')}
                    onClick={onDeleteAccountClick}
                    variant="error"
                />
            {/if}
        </account-actions-menu>
    </Modal>
</account-actions-menu>
