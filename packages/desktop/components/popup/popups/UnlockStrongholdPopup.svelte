<script lang="ts">
    import { PasswordInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { unlockStronghold } from '@core/profile/actions'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let subtitle: string | undefined = undefined
    export let returnPassword = false

    export let onSuccess: (..._: any[]) => void = () => {}
    export let onCancel: (..._: any[]) => void = () => {}

    let password: string
    let error = ''
    let isBusy = false

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            const response = await unlockStronghold(password)
            closePopup()
            onSuccess(returnPassword ? password : response)
        } catch (err) {
            console.error(err)
            error = localize(err?.message ?? err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
        onCancel?.()
    }
</script>

<PopupTemplate
    title={localize('popups.password.title')}
    description={subtitle ?? localize('popups.password.subtitle')}
    busy={isBusy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        type: 'submit',
        form: 'password-popup-form',
        text: localize('actions.unlock'),
        disabled: !password || password.length === 0,
    }}
>
    <form id="password-popup-form" class="flex w-full flex-col" on:submit|preventDefault={onSubmit}>
        <PasswordInput bind:value={password} label={localize('general.password')} autofocus bind:error />
    </form>
</PopupTemplate>
