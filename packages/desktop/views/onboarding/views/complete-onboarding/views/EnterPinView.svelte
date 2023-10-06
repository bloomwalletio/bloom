<script lang="ts">
    import { Error, PinInput, Text } from '@bloomwalletio/ui'
    import { initialisePincodeManager } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { isValidPin } from '@core/utils'
    import { OnboardingLayout } from '@views/components'
    import { completeOnboardingRouter } from '../complete-onboarding-router'

    export let busy = false

    let setPinInput = ''
    let setPinInputError = ''
    let confirmPinInput = ''
    let confirmPinInputError = ''
    let arePinInputsMatching = false
    let arePinInputsValid = false
    let confirmPinInputElement: PinInput

    $: setPinInput, (setPinInputError = '')
    $: confirmPinInput, (confirmPinInputError = '')
    $: arePinInputsMatching = setPinInput === confirmPinInput
    $: arePinInputsValid = isValidPin(setPinInput) && isValidPin(confirmPinInput)
    $: if (arePinInputsValid && !arePinInputsMatching) {
        confirmPinInputError = localize('error.pincode.match')
    } else {
        confirmPinInputError = ''
    }

    async function onContinueClick(): Promise<void> {
        busy = true
        await initialisePincodeManager(setPinInput)
        busy = false

        $completeOnboardingRouter.next()
    }

    function onBackClick(): void {
        $completeOnboardingRouter.previous()
    }

    function onSetPinClick(): void {
        resetPinInputErrors()
    }

    function resetPinInputErrors(): void {
        setPinInputError = ''
        confirmPinInputError = ''
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.storageProtectionSetup.setupPinProtection.title')}
    description={localize('views.onboarding.storageProtectionSetup.setupPinProtection.body')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !arePinInputsValid || !arePinInputsMatching,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
    size="fit"
>
    <form
        slot="content"
        id="setup-pin"
        class="flex flex-col justify-center items-center gap-7"
        on:submit|preventDefault={onSetPinClick}
    >
        <pin-input-container class="flex flex-col w-fit gap-3">
            <Text type="body1">
                {localize('actions.setPin')}
            </Text>
            <PinInput bind:value={setPinInput} autofocus disabled={busy} error={!!setPinInputError} />
            <Error error={setPinInputError} />
        </pin-input-container>
        <pin-input-container class="flex flex-col w-fit gap-3">
            <Text type="body1">
                {localize('actions.confirmPin')}
            </Text>
            <PinInput
                bind:value={confirmPinInput}
                disabled={busy}
                error={!!confirmPinInputError}
                bind:this={confirmPinInputElement}
            />
            <Error error={confirmPinInputError} />
        </pin-input-container>
    </form>
</OnboardingLayout>
