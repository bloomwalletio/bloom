<script lang="ts">
    import { Copyable, Icon, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { AccountSwitcher, FormattedBalance } from '@components'
    import { ISettingsState, settingsState } from '@contexts/settings/stores'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { formatCurrency, localize } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { activeProfile } from '@core/profile/stores'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { IPopupState, IProfileAuthPopupState, popupState, profileAuthPopup } from '@desktop/auxiliary/popup'
    import { Pane } from '@ui'
    import { onDestroy, tick } from 'svelte'

    let tokenBalance: string
    let fiatBalance: string

    function updateBalances(): void {
        const tokens = $selectedAccountTokens?.[$activeProfile.network.id]
        const networkBaseCoin: ITokenWithBalance = tokens?.baseCoin
        tokenBalance = formatTokenAmountBestMatch(networkBaseCoin.balance.total, networkBaseCoin.metadata)
        fiatBalance = formatCurrency(getFiatValueFromTokenAmount(networkBaseCoin.balance.total, networkBaseCoin))
    }

    async function resetTransak(): Promise<void> {
        await Platform.closeTransak()
        await Platform.openTransak({
            currency: $activeProfile?.settings.marketCurrency,
            address: $selectedAccount.depositAddress,
            service: 'BUY',
        })
        await updateTransakBounds()
    }

    $: if ($selectedAccountIndex !== undefined) {
        updateBalances()
        void resetTransak()
    }

    $: void handlePopupState($popupState, $profileAuthPopup, $settingsState)
    async function handlePopupState(
        state: IPopupState,
        profilePopupState: IProfileAuthPopupState,
        settingsState: ISettingsState
    ): Promise<void> {
        if (state.active || profilePopupState.active || settingsState.open) {
            await Platform.minimizeTransak()
        } else {
            await tick()
            await Platform.restoreTransak()
        }
    }

    let transakContainer: HTMLDivElement | undefined
    async function updateTransakBounds(): Promise<void> {
        if (!transakContainer) {
            return
        }

        const rect = transakContainer.getBoundingClientRect()
        const transakPaneStyles = getComputedStyle(transakContainer?.children[0])
        const extractDigitsToNumbers = (str: string) => Number(str?.replace(/\D/g, '') ?? 0)
        const borderTop = extractDigitsToNumbers(transakPaneStyles?.borderTopWidth)
        const borderBottom = extractDigitsToNumbers(transakPaneStyles?.borderBottomWidth)
        const borderLeft = extractDigitsToNumbers(transakPaneStyles?.borderLeftWidth)
        const borderRight = extractDigitsToNumbers(transakPaneStyles?.borderRightWidth)

        await Platform.updateTransakBounds({
            x: rect.x + borderLeft + borderRight,
            y: rect.y + borderTop,
            width: rect.width - borderLeft - borderRight,
            height: rect.height - borderTop - borderBottom,
        })
    }

    onDestroy(() => {
        void Platform.closeTransak()
    })
</script>

<svelte:window on:resize={updateTransakBounds} />

<div class="flex gap-4 h-full">
    <div class="account-panel">
        <Pane
            classes="flex flex-col justify-center items-center w-full px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg"
        >
            <div class="w-full flex justify-between items-center gap-2">
                <div class="flex items-center gap-2">
                    <icon-container class="bg-black p-1 rounded-full">
                        <Icon name={IconName.Iota} size="xs" customColor="#ffffff" />
                    </icon-container>
                    <Text type="body2">IOTA</Text>
                </div>
                <AccountSwitcher placement="bottom-end" />
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
    </div>
    <div class="transak-panel" bind:this={transakContainer}>
        <Pane
            classes="flex flex-col justify-center items-center w-full h-full px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg"
        ></Pane>
    </div>
    <div class="info-panel">
        <Pane
            classes="flex flex-col justify-start items-start w-full px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg"
        >
            <Pill color="brand">{localize('general.info')}</Pill>
            <Text color="secondary">{localize('views.buySell.info.receive')}</Text>
            <Text color="secondary">{localize('views.buySell.info.multipleAccounts')}</Text>
            <Text color="secondary">{localize('views.buySell.info.changingAccounts')}</Text>
        </Pane>
    </div>
</div>

<style lang="postcss">
    .transak-panel {
        @apply flex-1 min-w-[360px];
    }

    .account-panel,
    .info-panel {
        @apply max-w-md;
    }

    .account-panel {
        @apply shrink-0 w-[287px];
    }
</style>
