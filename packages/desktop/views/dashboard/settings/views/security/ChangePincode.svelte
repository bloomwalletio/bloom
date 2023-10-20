<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Button, Error, PinInput, Text } from '@bloomwalletio/ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { PIN_LENGTH } from '@core/utils'
    import { get } from 'svelte/store'

    let currentPincode: string = ''
    let newPincode: string = ''
    let confirmedPincode: string = ''
    let currentPincodeError: string = ''
    let newPincodeError: string = ''
    let confirmationPincodeError = ''
    let busy: boolean = false

    $: currentPincode, newPincode, confirmedPincode, resetErrors()

    function resetErrors(): void {
        currentPincodeError = ''
        newPincodeError = ''
        confirmationPincodeError = ''
    }

    function resetInputs(): void {
        currentPincode = ''
        newPincode = ''
        confirmedPincode = ''
    }

    function resetForm(): void {
        resetInputs()
        resetErrors()
    }

    function onSuccess(_message: string): void {
        busy = false
        showNotification({
            variant: 'success',
            text: _message,
        })
        resetForm()
    }

    function onError(_message: string): void {
        busy = false
        showNotification({
            variant: 'error',
            text: _message,
        })
    }

    async function validateFormAndSetErrors(): Promise<boolean> {
        try {
            if (currentPincode && newPincode && confirmedPincode) {
                if (newPincode.length !== PIN_LENGTH) {
                    newPincodeError = localize('error.pincode.length', {
                        values: {
                            length: PIN_LENGTH,
                        },
                    })
                    return false
                } else if (newPincode !== confirmedPincode) {
                    confirmationPincodeError = localize('error.pincode.match')
                    return false
                } else if (!(await Platform.PincodeManager.verify(get(activeProfile)?.id, currentPincode))) {
                    currentPincodeError = localize('error.pincode.incorrect')
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        } catch (err) {
            return false
        }
    }

    async function changePincode(): Promise<void> {
        try {
            if (await validateFormAndSetErrors()) {
                busy = true
                await Platform.PincodeManager.set(get(activeProfile)?.id, newPincode)
                onSuccess(localize('general.pinCodeSuccess'))
            }
        } catch {
            onError(localize('general.pinCodeFailed'))
        }
    }
</script>

<form on:submit|preventDefault={changePincode} id="pincode-change-form">
    <Text type="body2" class="mb-2">{localize('views.settings.changePincode.title')}</Text>
    <Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.changePincode.description')}</Text>
    <pin-input-container class="flex flex-col w-fit gap-3 mb-3">
        <Text type="body2">
            {localize('views.settings.changePincode.currentPincode')}
        </Text>
        <PinInput bind:value={currentPincode} autofocus disabled={busy} error={!!currentPincodeError} />
        <Error error={currentPincodeError} />
    </pin-input-container>
    <pin-input-container class="flex flex-col w-fit gap-3 mb-3">
        <Text type="body2">
            {localize('views.settings.changePincode.newPincode')}
        </Text>
        <PinInput bind:value={newPincode} disabled={busy} error={!!newPincodeError} />
        <Error error={newPincodeError} />
    </pin-input-container>
    <pin-input-container class="flex flex-col w-fit gap-3 mb-6">
        <Text type="body2">
            {localize('actions.confirmPin')}
        </Text>
        <PinInput bind:value={confirmedPincode} disabled={busy} error={!!confirmationPincodeError} />
        <Error error={confirmationPincodeError} />
    </pin-input-container>
    <Button
        text={localize('views.settings.changePincode.action')}
        type="submit"
        disabled={busy ||
            currentPincode?.length < PIN_LENGTH ||
            newPincode?.length < PIN_LENGTH ||
            confirmedPincode?.length < PIN_LENGTH}
        {busy}
    />
</form>
