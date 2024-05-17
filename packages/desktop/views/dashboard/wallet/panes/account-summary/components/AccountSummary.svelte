<script lang="ts">
    import { notifyClient } from '@auxiliary/wallet-connect/stores'
    import { buildAccountForWalletConnect } from '@auxiliary/wallet-connect/utils'
    import { Button, IconName } from '@bloomwalletio/ui'
    import { AccountActionsMenu, AccountSwitcher, FormattedBalance } from '@components'
    import { IAccountState } from '@core/account'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { getEvmNetwork } from '@core/network'
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
        void subscribeToNotifications()

        // openPopup({
        //     id: PopupId.ReceiveAddress,
        // })
    }

    async function subscribeToNotifications(): Promise<void> {
        const network = getEvmNetwork('eip155:1')
        if (!$notifyClient || !network) return
        // Get the domain of the target dapp from the Explorer API response (https://explorer-api.walletconnect.com/v3/dapps?projectId=YOUR_PROJECT_ID&is_notify_enabled=true)
        const appDomain = new URL('https://walletconnect.com').hostname

        const account = buildAccountForWalletConnect($selectedAccount as IAccountState, network.id)
        if (!account) return

        await $notifyClient.subscribe({
            account,
            appDomain,
        })
        console.error('Subscribed to notifications')

        const subscriptions = $notifyClient.getActiveSubscriptions({ account })

        console.error('Subscriptions:', subscriptions)

        const notifications = $notifyClient.getNotificationHistory({ topic: subscriptions[0].topic })

        console.error('Notifications:', notifications)
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
