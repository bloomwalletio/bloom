<script lang="ts">
    import { Pane } from '@ui'
    import { AccountSwitcher, FormattedBalance } from '@components'
    import { Button, Icon, IconName, Text } from '@bloomwalletio/ui'
    import { formatCurrency } from '@core/i18n'
    import { selectedAccountTokens } from '@core/token/stores'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { getFiatAmountFromTokenValue } from '@core/market/actions'
    import { activeProfile } from '@core/profile/stores'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { DashboardRoute, dashboardRoute } from '@core/router'

    let tokenBalance: string
    let fiatBalance: string

    function updateBalances(): void {
        const tokens = $selectedAccountTokens?.[$activeProfile.network.id]
        const networkBaseCoin: ITokenWithBalance = tokens?.baseCoin
        tokenBalance = formatTokenAmountBestMatch(networkBaseCoin.balance.total, networkBaseCoin.metadata)
        fiatBalance = formatCurrency(getFiatAmountFromTokenValue(networkBaseCoin.balance.total, networkBaseCoin))
    }

    $: $selectedAccountIndex, updateBalances()

    async function onBuyClick(): Promise<void> {
        void Platform.openTransak({ currency: $activeProfile?.settings.marketCurrency, address: $selectedAccount.depositAddress, service: 'BUY' })
    }

    async function onSellClick(): Promise<void> {
        void Platform.openTransak({ currency: $activeProfile?.settings.marketCurrency, address: $selectedAccount.depositAddress, service: 'SELL' })
    }
</script>

<Pane classes="flex flex-col justify-center items-center w-fit px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    <AccountSwitcher />
    <icon-container class="bg-black p-2 rounded-full">
        <Icon name={IconName.Iota} size="xl" customColor="#ffffff" />
    </icon-container>
    <div class="flex flex-col gap-1 justify-center items-center">
        <FormattedBalance balanceText={tokenBalance} textType="h6" />
        <Text type="body1" textColor="secondary">{fiatBalance}</Text>
    </div>
    <div class="flex justify-center items-center gap-2">
        {#if features?.buySell?.buy?.enabled}
            <Button text="Buy" on:click={onBuyClick} />
        {/if}
        {#if features?.buySell?.sell?.enabled}
            <Button text="Sell" on:click={onSellClick} />
        {/if}
    </div>
</Pane>
