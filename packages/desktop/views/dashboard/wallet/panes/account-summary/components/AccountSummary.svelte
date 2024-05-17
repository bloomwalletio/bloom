<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Button, IconName } from '@bloomwalletio/ui'
    import { AccountActionsMenu, AccountSwitcher, FormattedBalance } from '@components'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { SupportedL1EvmNetworkId } from '@core/network'
    import { allAccountFiatBalances, selectedAccountTokens } from '@core/token/stores'
    import { resetSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { SendFlowRouter, sendFlowRouter } from '@views'

    let formattedBalance: string
    $: $selectedAccountTokens, (formattedBalance = getTotalBalance())

    function getTotalBalance(): string {
        return formatCurrency($allAccountFiatBalances[$selectedAccountIndex])
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
        subscribeToNotifications()

        // openPopup({
        //     id: PopupId.ReceiveAddress,
        // })
    }

    function subscribeToNotifications(): void {
        // Get the domain of the target dapp from the Explorer API response (https://explorer-api.walletconnect.com/v3/dapps?projectId=YOUR_PROJECT_ID&is_notify_enabled=true)
        const appDomain = new URL('https://gm.walletconnect.com').hostname
        notificationsManager.subscribeToDapp(appDomain, $selectedAccount, SupportedL1EvmNetworkId.Ethereum)
    }
</script>

<account-summary class="w-full h-full px-6 pb-6 pt-4 flex flex-col justify-between">
    <account-summary-header class="w-full flex flex-row justify-between items-center">
        <AccountSwitcher hasCreateAccount />
        <AccountActionsMenu />
    </account-summary-header>
    <FormattedBalance balanceText={formattedBalance} autoAdjustFontSize />
    <account-summary-actions class="mt-4 space-x-2 flex flex-row justify-between items-center">
        <Button text={localize('actions.send')} width="half" icon={IconName.Send} on:click={onSendClick} />
        <Button
            variant="outlined"
            text={localize('actions.receive')}
            width="half"
            icon={IconName.Receive}
            color="info"
            on:click={onReceiveClick}
        />
    </account-summary-actions>
</account-summary>
