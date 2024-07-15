<script lang="ts">
    import { Alert, Text } from '@bloomwalletio/ui'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary'
    export let title: string
    export let description: string = ''
    export let text: string = ''
    export let alert: { variant?: 'success' | 'warning' | 'danger' | 'info'; text: string } | undefined = undefined
    export let backText: string = localize('actions.cancel')
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => Promise<void>
    export let onCancel: (() => void) | undefined = undefined
    export let _onMount: ((..._: any[]) => Promise<void>) | undefined = async () => {}

    let isBusy = false

    async function onConfirmClick(): Promise<void> {
        isBusy = true
        try {
            if (onConfirm) {
                await onConfirm()
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

    onMount(async () => {
        if (_onMount) {
            try {
                await _onMount()
            } catch (err) {
                handleError(err)
            }
        }
    })
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
    {#if alert}
        <Alert variant="info" {...alert} />
    {/if}
    {#if text}
        <Text class="break-all">{text}</Text>
    {/if}
</PopupTemplate>
