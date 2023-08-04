<script lang="ts">
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { showNotification as _showNotification } from '@auxiliary/notification'
    import { openPopup, PopupId } from '../../../../../desktop/lib/auxiliary/popup'
    import { Button, ButtonSize } from '@ui'

    export let isBusy = false
    export let message = ''
    export let showNotification = false
    export let overrideTitle = ''

    function handleExportStrongholdResponse(cancelled, error): void {
        setTimeout(
            () => {
                message = ''
            },
            cancelled ? 0 : 5000
        )
        isBusy = false
        if (!cancelled) {
            if (error) {
                message = localize('general.exportingStrongholdFailed')
                showNotification &&
                    _showNotification({
                        variant: 'error',
                        text: localize(error),
                    })
            } else {
                message = localize('general.exportingStrongholdSuccess')
                showNotification &&
                    _showNotification({
                        variant: 'success',
                        text: localize('general.exportingStrongholdSuccess'),
                    })
            }
        }
    }

    function onExportClick(): void {
        isBusy = false
        message = ''

        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: (password: string) => {
                    isBusy = true
                    message = localize('general.exportingStronghold')
                    exportStronghold(password, handleExportStrongholdResponse)
                },
                returnPassword: true,
                subtitle: localize('popups.password.backup'),
            },
        })
    }
</script>

<Button
    size={ButtonSize.Medium}
    inlineStyle="min-width: 156px;"
    onClick={onExportClick}
    disabled={isBusy}
    {...$$restProps}
>
    {overrideTitle || localize('actions.export')}
</Button>
