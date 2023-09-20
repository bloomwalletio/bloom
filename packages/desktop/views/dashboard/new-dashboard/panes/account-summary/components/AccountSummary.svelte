<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { AccountActionsMenu } from '@components'
    import { IAccountState } from '@core/account'
    import { formatCurrency } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { getActiveNetworkId } from '@core/network'
    import { ITokenWithBalance } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { resetSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { SendFlowRouter, sendFlowRouter } from '@views'

    export let account: IAccountState

    let formattedBalance: [string, string]
    $: $selectedAccountTokens, (formattedBalance = getFormattedBalance())

    function getFormattedBalance(): [string, string] {
        const baseCoin: ITokenWithBalance = $selectedAccountTokens?.[getActiveNetworkId()]?.baseCoin
        const formattedCurrency = formatCurrency(getMarketAmountFromTokenValue(baseCoin.balance.available, baseCoin))
        const length = formattedCurrency.length
        return [formattedCurrency.slice(0, length - 3), formattedCurrency.slice(length - 3, length)]
    }

    function onSendClick(): void {
        resetSendFlowParameters()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        sendFlowRouter.set(new SendFlowRouter(undefined))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

<account-summary class="w-full h-full p-6 flex flex-col justify-between">
    <account-summary-header class="w-full flex flex-row justify-between items-center">
        <Text type="body1" align="center" color="indigo-950" truncate>{account.name}</Text>
        <AccountActionsMenu />
    </account-summary-header>
    <account-summary-balance class="flex flex-row">
        <Text type="h1" truncate>{formattedBalance[0]}</Text>
        <Text type="h1" color="text-secondary" truncate>{formattedBalance[1]}</Text>
    </account-summary-balance>
    <account-summary-actions class="mt-4 flex flex-row justify-between items-center">
        <Button text="Send" width="full" size="lg" icon={IconName.Send} on:click={onSendClick} />
    </account-summary-actions>
</account-summary>
