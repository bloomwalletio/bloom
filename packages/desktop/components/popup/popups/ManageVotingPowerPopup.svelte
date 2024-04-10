<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { setVotingPower } from '@contexts/governance/actions'
    import { isAccountVoting } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { PopupId, closePopup, openPopup, popupState } from '@desktop/auxiliary/popup'
    import { TokenAmountWithSliderInput } from '@ui'
    import { PopupTemplate } from '@components/popup'

    export let newVotingPower: bigint = undefined

    let tokenAmountInputWithSlider: TokenAmountWithSliderInput
    let rawAmount = newVotingPower ?? $selectedAccount?.votingPower
    let confirmDisabled = false

    $: token = $visibleSelectedAccountTokens[$activeProfile?.network?.id]?.baseCoin
    $: votingPower = $selectedAccount?.votingPower
    $: hasTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress ||
        $selectedAccount?.hasVotingTransactionInProgress ||
        $selectedAccount?.isTransferring
    $: rawAmount, hasTransactionInProgress, setConfirmDisabled()

    function setConfirmDisabled(): void {
        confirmDisabled = rawAmount === $selectedAccount?.votingPower || hasTransactionInProgress
    }

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            tokenAmountInputWithSlider?.validate(true)

            if (!rawAmount && isAccountVoting($selectedAccount.index)) {
                openPopup({ id: PopupId.VotingPowerToZero })
                return
            }

            try {
                await checkActiveProfileAuth()
            } catch {
                return
            }

            // After unlocking stronghold popup, the popup tracks newVotingPower to show it when reopened.
            $popupState.props = { newVotingPower: rawAmount }
            await setVotingPower(rawAmount)
        } catch (err) {
            handleError(err)
        }
    }
</script>

<PopupTemplate
    title={localize('popups.manageVotingPower.title')}
    description={localize('popups.manageVotingPower.body')}
    backButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    continueButton={{
        type: 'submit',
        text: localize('actions.confirm'),
        disabled: confirmDisabled,
        form: 'manage-voting-power',
    }}
    busy={hasTransactionInProgress}
>
    <form id="manage-voting-power" on:submit|preventDefault={onSubmit}>
        <div class="space-y-4">
            <TokenAmountWithSliderInput
                bind:this={tokenAmountInputWithSlider}
                bind:rawAmount
                {token}
                disabled={hasTransactionInProgress}
                {votingPower}
            />
            <Alert variant="info" text={localize('popups.manageVotingPower.hint')} />
        </div>
    </form>
</PopupTemplate>
