<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary'
    export let title: string
    export let description: string = ''
    export let input: { placeholder: string; startValue: string } = { placeholder: '', startValue: '' }
    export let backText: string = localize('actions.cancel')
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: (inputText: string) => Promise<void>
    export let onCancel: (() => void) | undefined = undefined

    let isBusy = false
    let inputText = input.startValue

    async function onConfirmClick(): Promise<void> {
        isBusy = true
        try {
            if (onConfirm) {
                await onConfirm(inputText)
            } else {
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        if (onCancel) {
            onCancel()
        } else {
            closePopup()
        }
    }
</script>

<PopupTemplate
    {title}
    {description}
    busy={isBusy}
    backButton={{
        text: backText,
        onClick: onCancelClick,
    }}
    continueButton={{
        color: variant,
        text: confirmText,
        onClick: onConfirmClick,
    }}
>
    <TextInput bind:value={inputText} label={input.placeholder} />
</PopupTemplate>
