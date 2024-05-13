<script lang="ts">
    import { Pane } from '@ui'
    import { AccountSwitcher, FormattedBalance } from '@components'
    import { Copyable, Icon, IconName, Text } from '@bloomwalletio/ui'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { formatCurrency } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmount } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'

    let tokenBalance: string = ''
    let fiatBalance: string = ''

    function updateBalances(): void {
        const tokens = $selectedAccountTokens?.[$activeProfile.network.id]
        const networkBaseCoin = tokens?.baseCoin
        if (!networkBaseCoin) return
        tokenBalance = formatTokenAmount(networkBaseCoin.balance.total, networkBaseCoin.metadata)
        fiatBalance = formatCurrency(getFiatValueFromTokenAmount(networkBaseCoin.balance.total, networkBaseCoin))
    }

    $: if ($selectedAccountIndex !== undefined) {
        updateBalances()
    }
</script>

<Pane classes="flex flex-col justify-center items-center w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    <div class="w-full flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
            <icon-container class="bg-black p-1 rounded-full">
                <Icon name={IconName.Iota} size="sm" customColor="#ffffff" />
            </icon-container>
            <Text type="body2">IOTA</Text>
        </div>
        <AccountSwitcher compact placement="bottom-end" />
    </div>
    <div class="w-full flex flex-col gap-1 justify-center">
        <FormattedBalance balanceText={tokenBalance} textType="h4" />
        <Text type="h6" textColor="secondary">{fiatBalance}</Text>
    </div>
    <Copyable value={$selectedAccount?.depositAddress}>
        <div class="bg-surface-2 dark:bg-surface-2-dark rounded-xl py-2 px-3">
            <Text type="pre-sm" textColor="secondary" class="break-all whitespace-normal">
                {$selectedAccount?.depositAddress}
            </Text>
        </div>
    </Copyable>
</Pane>
