<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'

    export let onConfirm: () => Promise<void> = undefined
    export let onCancel: () => void = undefined
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

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
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.signMessage.title')}
    </Text>
    <div class="space-y-4">
        <TextHint info text={localize('popups.signMessage.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            disabled={$selectedAccount.isTransferring || isBusy}
            isBusy={$selectedAccount.isTransferring || isBusy}
            onClick={onConfirmClick}
        >
            {localize('popups.signMessage.action')}
        </Button>
    </popup-buttons>
</div>
