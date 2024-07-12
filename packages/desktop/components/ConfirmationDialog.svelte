<script lang="ts">
    import { fade } from 'svelte/transition'
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupTemplate } from './popup'

    export let visible: boolean = false
    export let variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary'
    export let title: string
    export let description: string = ''
    export let alert: { variant?: 'success' | 'warning' | 'danger' | 'info'; text: string } | undefined = undefined
    export let backText: string = localize('actions.cancel')
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => void

    export function openDialog(): void {
        visible = true
    }

    function closeDialog(): void {
        visible = false
    }

    function onConfirmClick(): void {
        onConfirm()
        closeDialog()
    }
</script>

{#if visible}
    <overlay in:fade|global={{ duration: 100 }}>
        <dialog-container class="popup">
            <PopupTemplate
                {title}
                {description}
                backButton={{
                    text: backText,
                    onClick: closeDialog,
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
            </PopupTemplate>
        </dialog-container>
    </overlay>
{/if}

<style lang="postcss">
    overlay {
        @apply inset-0 fixed z-40 flex items-center justify-center bg-neutral-6/75;
    }

    dialog-container {
        @apply max-w-[25rem];
    }
</style>
