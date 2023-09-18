<script lang="ts">
    import { PinInput, Text } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { initialisePincodeManager } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { isValidPin } from '@core/utils'
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
    description={localize('views.onboarding.storageProtectionSetup.setupPinProtection.body1')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !arePinInputsValid || !arePinInputsMatching,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content">
        <div class="flex flex-col mb-8">
            <Text type="p" secondary highlighted
                >{localize('views.onboarding.storageProtectionSetup.setupPinProtection.body2')}</Text
            >
        </div>
        <form id="setup-pin" class="flex flex-col" on:submit|preventDefault={onSetPinClick}>
            <PinInput
                bind:value={setPinInput}
                glimpse
                classes="w-full mx-auto block mb-4"
                autofocus
                disabled={busy}
                error={setPinInputError}
                label={localize('actions.setPin')}
                on:filled={confirmPinInputElement.focus}
                on:submit={onSetPinClick}
            />
            <PinInput
                bind:value={confirmPinInput}
                glimpse
                classes="w-full mx-auto block"
                disabled={busy}
                error={confirmPinInputError}
                label={localize('actions.confirmPin')}
                bind:this={confirmPinInputElement}
                on:submit={onSetPinClick}
            />
        </form>
    </div>
</OnboardingLayout>
