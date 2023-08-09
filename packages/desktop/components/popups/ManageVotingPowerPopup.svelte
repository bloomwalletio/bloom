<script lang="ts">
    import { setVotingPower } from '@contexts/governance/actions'
    import { isAccountVoting } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { convertToRawAmount } from '@core/token'
    import { PopupId, closePopup, openPopup, popupState } from '@desktop/auxiliary/popup'
    import { Button, Text, TextHint, TokenAmountWithSliderInput } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let newVotingPower: string = undefined

    let tokenAmountInput: TokenAmountWithSliderInput
    let amount: string
    let rawAmount = newVotingPower ?? $selectedAccount?.votingPower
    let confirmDisabled = false

    $: token = $visibleSelectedAccountTokens[$activeProfile?.network.id].baseCoin
    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: hasTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress ||
        $selectedAccount?.hasVotingTransactionInProgress ||
        $selectedAccount?.isTransferring
    $: amount, hasTransactionInProgress, setConfirmDisabled()

    function setConfirmDisabled(): void {
        if (!amount) {
            confirmDisabled = true
            return
        }
        const convertedSliderAmount = convertToRawAmount(amount, token?.metadata)?.toString()
        confirmDisabled = convertedSliderAmount === $selectedAccount?.votingPower || hasTransactionInProgress
    }

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            await tokenAmountInput?.validate(true)

            if (amount === '0' && isAccountVoting($selectedAccount.index)) {
                openPopup({ id: PopupId.VotingPowerToZero })
                return
            }

            // After unlocking stronghold popup, the popup tracks newVotingPower to show it when reopened.
            $popupState.props = { newVotingPower: rawAmount }

            await checkActiveProfileAuth(
                async () => {
                    await setVotingPower(rawAmount)
                },
                { stronghold: true, ledger: false }
            )
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<form id="manage-voting-power" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.manageVotingPower.title')}</Text>
    <Text type={TextType.p} classes="mb-5">{localize('popups.manageVotingPower.body')}</Text>
    <div class="space-y-4 mb-6">
        <TokenAmountWithSliderInput
            bind:this={tokenAmountInput}
            bind:rawAmount
            bind:amount
            {token}
            disabled={hasTransactionInProgress}
            {votingPower}
        />
        <TextHint info text={localize('popups.manageVotingPower.hint')} />
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline disabled={hasTransactionInProgress} classes="w-full" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button
            type={HTMLButtonType.Submit}
            disabled={confirmDisabled}
            isBusy={hasTransactionInProgress}
            classes="w-full"
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
