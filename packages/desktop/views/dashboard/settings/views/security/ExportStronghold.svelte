<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { exportStronghold } from '@contexts/settings'
    import { Button, Text, Spinner } from '@bloomwalletio/ui'

    let busy = false
    let message = ''

    function handleExportStrongholdResponse(cancelled: boolean, error?: string | undefined): void {
        setTimeout(
            () => {
                message = ''
            },
            cancelled ? 0 : 5000
        )
        busy = false
        if (!cancelled) {
            if (error) {
                message = localize('general.exportingStrongholdFailed')
            } else {
                message = localize('general.exportingStrongholdSuccess')
            }
        }
    }

    function onExportClick(): void {
        busy = false
        message = ''

        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: (password: string) => {
                    busy = true
                    message = localize('general.exportingStronghold')
                    exportStronghold(password, handleExportStrongholdResponse)
                },
                returnPassword: true,
                subtitle: localize('popups.password.backup'),
            },
        })
    }
</script>

<div class="mb-3">
    <Text type="h4">{localize('views.settings.exportStronghold.title')}</Text>
</div>
<div class="mb-5">
    <Text textColor="secondary">{localize('views.settings.exportStronghold.description')}</Text>
</div>
<div class="flex flex-row items-center gap-4">
    <Button text={localize('actions.export')} disabled={busy} on:click={onExportClick} />
    <div class="flex flex-row items-center gap-2">
        {#if busy}
            <Spinner textColor="secondary" />
        {/if}
        {#if message}
            <Text textColor="secondary">{message}</Text>
        {/if}
    </div>
</div>
