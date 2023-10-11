<script lang="ts">
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { exportStronghold } from '@contexts/settings'
    import { Button, Text } from '@bloomwalletio/ui'

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
<div class="flex flex-row items-center">
    <Button text={localize('actions.export')} disabled={busy} on:click={onExportClick} />
    <Spinner {busy} {message} classes="ml-2" />
</div>
