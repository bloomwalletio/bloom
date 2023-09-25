<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { AccountActionsMenu, AccountSwitcher, FormattedBalance } from '@components'
    import { IAccountState } from '@core/account'
    import { formatCurrency } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { getMarketAmountFromTokenValue } from '@core/market/actions'
    import { NetworkId } from '@core/network'
    import { ITokenWithBalance } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { resetSendFlowParameters } from '@core/wallet'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { SendFlowRouter, sendFlowRouter } from '@views'

    export let account: IAccountState
    export let stardustNetworkId: NetworkId
    export let evmChainNetworkId: NetworkId

    let formattedBalance: string
    $: $selectedAccountTokens, (formattedBalance = getTotalBalance())

    function getTotalBalance(): string {
        const stardustBaseToken: ITokenWithBalance = $selectedAccountTokens?.[stardustNetworkId]?.baseCoin
        const evmChainBaseToken: ITokenWithBalance = $selectedAccountTokens?.[evmChainNetworkId]?.baseCoin
        const availableBalance =
            (stardustBaseToken?.balance?.available ?? 0) + (evmChainBaseToken?.balance?.available ?? 0)
        return formatCurrency(getMarketAmountFromTokenValue(availableBalance, stardustBaseToken))
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
    <FormattedBalance balanceText={formattedBalance} />
    <account-summary-actions class="mt-4 flex flex-row justify-between items-center">
        <Button text="Send" width="full" size="lg" icon={IconName.Send} on:click={onSendClick} />
    </account-summary-actions>
</account-summary>
