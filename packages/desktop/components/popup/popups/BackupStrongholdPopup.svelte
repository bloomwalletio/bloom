<script lang="ts">
    import { localize } from '@core/i18n'
    import { Logo } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import { ProfileAuthPopupId, closePopup, openProfileAuthPopup } from '@desktop/auxiliary/popup'
    import { LogoName } from '@auxiliary/logo'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { exportStronghold } from '@contexts/settings/actions'
    import { showNotification } from '@auxiliary/notification/actions'

    let busy = false

    function onCancelClick(): void {
        closePopup()
    }

    function handleExportStrongholdResponse(cancelled: boolean, error?: string | undefined): void {
        busy = false
        if (cancelled) {
            return
        }
        if (error) {
            showNotification({
                variant: 'error',
                text: localize(error),
            })
        } else {
            showNotification({
                variant: 'success',
                text: localize('general.exportingStrongholdSuccess'),
            })
        }
    }

    function onExportClick(): void {
        busy = false

        openProfileAuthPopup({
            id: ProfileAuthPopupId.UnlockStronghold,
            props: {
                subtitle: localize('popups.password.backup'),
                onSuccess: (password: string) => {
                    busy = true
                    exportStronghold(password, handleExportStrongholdResponse)
                },
                returnPassword: true,
            },
        })
    }
</script>

<PopupTemplate
    title={localize('popups.backupStronghold.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
        disabled: busy,
    }}
    continueButton={{
        text: localize('actions.backup'),
        onClick: onExportClick,
        disabled: busy,
    }}
    {busy}
>
    <div class="flex flex-col space-y-5">
        <div class="w-full p-10 bg-surface-1 dark:bg-surface-1-dark rounded-xl flex justify-center content-center">
            <Logo width="50%" logo={LogoName.Stronghold} />
        </div>
        <div class="w-full">
            <Text textColor="secondary" align="justify">
                {localize('popups.backupStronghold.body')}
            </Text>
        </div>
    </div>
</PopupTemplate>
