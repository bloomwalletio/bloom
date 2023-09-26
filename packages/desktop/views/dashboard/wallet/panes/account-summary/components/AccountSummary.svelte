<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { AccountActionsMenu, AccountSwitcher } from '@components'
    import { IAccountState } from '@core/account'
    import { formatCurrency, getDecimalSeparator } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { NetworkId } from '@core/network'
    import { ITokenWithBalance } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { resetSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { SendFlowRouter, sendFlowRouter } from '@views'
    import { activeProfile } from '@core/profile/stores'

    export let account: IAccountState
    export let stardustNetworkId: NetworkId
    export let evmChainNetworkId: NetworkId

    let formattedBalance: [string, string]
    $: $selectedAccountTokens, (formattedBalance = getFormattedBalance())

    function getFormattedBalance(): [string, string] {
        const stardustBaseToken: ITokenWithBalance = $selectedAccountTokens?.[stardustNetworkId]?.baseCoin
        const evmChainBaseToken: ITokenWithBalance = $selectedAccountTokens?.[evmChainNetworkId]?.baseCoin
        const availableBalance =
            (stardustBaseToken?.balance?.available ?? 0) + (evmChainBaseToken?.balance?.available ?? 0)
        const formattedCurrency = formatCurrency(getMarketAmountFromTokenValue(availableBalance, stardustBaseToken))
        const decimalSeparator = getDecimalSeparator($activeProfile?.settings?.marketCurrency)
        const [integer, decimals] = formattedCurrency.split(decimalSeparator)
        return [integer, decimalSeparator + decimals]
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

<account-summary class="w-full h-full px-6 pb-6 pt-4 flex flex-col justify-between">
    <account-summary-header class="w-full flex flex-row justify-between items-center">
        <AccountSwitcher />
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
