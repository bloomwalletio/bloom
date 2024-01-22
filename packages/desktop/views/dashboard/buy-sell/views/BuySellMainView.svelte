<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { AccountSwitcher, FormattedBalance } from '@components'
    import { ISettingsState, settingsState } from '@contexts/settings/stores'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { formatCurrency } from '@core/i18n'
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

        await Platform.updateTransakBounds({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
        })
    }

    onDestroy(() => {
        void Platform.closeTransak()
    })
</script>

<svelte:window on:resize={updateTransakBounds} />

<div class="grid-container">
    <div class="account-info">
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
            <div class="bg-surface-2 rounded-xl py-2 px-3">
                <Text type="pre-sm" textColor="secondary" class="break-all whitespace-normal">
                    {$selectedAccount?.depositAddress}
                </Text>
            </div>
        </Pane>
    </div>
    <div class="transak-container" bind:this={transakContainer}>
        <Pane
            classes="flex flex-col justify-center items-center w-full h-full px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg"
        ></Pane>
    </div>
    <div class="warning-container">
        <Pane
            classes="flex flex-col justify-center items-center w-full px-6 pb-6 pt-4 gap-4 bg-surface dark:bg-surface-dark shadow-lg"
        ></Pane>
    </div>
</div>

<style lang="postcss">
    .grid-container {
        @apply grid grid-cols-[1fr_482px_1fr] grid-rows-2 gap-4 h-full;
        grid-template-areas:
            'account transak warning'
            'account transak warning';
    }

    .account-info {
        grid-area: account;
    }

    .transak-container {
        grid-area: transak;
    }

    .warning-container {
        grid-area: warning;
    }
</style>
