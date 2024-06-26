<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { AccountActionsMenu, AccountSwitcher, FormattedBalance } from '@components'
    import { selectedAccountIndex } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { allAccountFiatBalances, selectedAccountTokens } from '@core/token/stores'
    import { resetSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { SendFlowRouter, sendFlowRouter } from '@views'

    let formattedBalance: string
    $: $selectedAccountTokens, (formattedBalance = getTotalBalance())

    function getTotalBalance(): string {
        return formatCurrency($allAccountFiatBalances[$selectedAccountIndex]?.total)
    }

    function onSendClick(): void {
        resetSendFlowParameters()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        sendFlowRouter.set(new SendFlowRouter())
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
            autofocusContent: false,
        })
    }

    function onReceiveClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
        })
    }
</script>

<account-summary class="w-full h-full px-6 pb-6 pt-4 flex flex-col justify-between">
    <account-summary-header class="w-full flex flex-row justify-between items-center">
        <AccountSwitcher hasCreateAccount />
        <AccountActionsMenu />
    </account-summary-header>
    <FormattedBalance balanceText={formattedBalance} autoAdjustFontSize />
    <account-summary-actions class="mt-4 space-x-2 flex flex-row justify-between items-center">
        <Button text={localize('actions.send')} size="sm" width="half" icon={IconName.Send} on:click={onSendClick} />
        <Button
            variant="outlined"
            size="sm"
            text={localize('actions.receive')}
            width="half"
            icon={IconName.Receive}
            color="info"
            on:click={onReceiveClick}
        />
    </account-summary-actions>
</account-summary>
