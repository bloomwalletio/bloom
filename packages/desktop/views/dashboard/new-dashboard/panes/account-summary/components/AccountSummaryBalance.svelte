<script lang="ts">
    import { Button, IconButton, IconName, Text } from '@bloomwalletio/ui'
    import { SendFlowRouter, sendFlowRouter } from '@views'
    import { IAccountState } from '@core/account'
    import { getAccountTokensForSelectedAccount } from '@core/token/actions'
    import { marketCoinPrices } from '@core/market/stores'
    import { getActiveNetworkId } from '@core/network'
    import { ITokenWithBalance } from '@core/token'
    import { formatCurrency } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { resetSendFlowParameters } from '@core/wallet'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import features from '@features/features'

    export let account: IAccountState

    const formattedBalance: [string, string] = getFormattedBalance()

    function getFormattedBalance(): [string, string] {
        const baseCoin: ITokenWithBalance =
            getAccountTokensForSelectedAccount($marketCoinPrices)?.[getActiveNetworkId()]?.baseCoin
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

<account-summary-balance class="w-full h-full p-6 flex flex-col justify-between">
    <account-summary-balance-header class="w-full flex flex-row justify-between items-center">
        <Text type="h6" align="center" color="indigo-950" truncate>{account.name}</Text>
        {#if features.wallet.newDashboard.accountSummaryMenu.enabled}
            <IconButton color="gray-500" name={IconName.DotsHorizontal} />
        {/if}
    </account-summary-balance-header>
    <account-summary-balance-amount class="flex flex-row">
        <Text type="h6" size="6xl" align="center" color="indigo-950" truncate>{formattedBalance[0]}</Text>
        <Text type="h6" size="6xl" align="center" color="gray-500" truncate>{formattedBalance[1]}</Text>
    </account-summary-balance-amount>
    <account-summary-balance-actions class="mt-4 flex flex-row justify-between items-center">
        <Button text="Send" width="full" size="lg" icon={IconName.Send} on:click={onSendClick} />
    </account-summary-balance-actions>
</account-summary-balance>
