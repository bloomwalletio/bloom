<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'
    import { refreshAccountTokensForActiveProfile } from '@core/wallet'

    import { showNotification } from '@auxiliary/notification'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'

    function refreshTokenMetadata(): void {
        refreshAccountTokensForActiveProfile(true)
        showNotification({
            variant: 'success',
            text: localize('notifications.refreshTokenMetadata.success'),
        })
        closePopup()
    }

    function onRefreshTokenMetadataClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.refreshTokenMetadata'),
                hint: localize('general.refreshTokenMetadataHint'),
                warning: true,
                confirmText: localize('actions.reset'),
                onConfirm: refreshTokenMetadata,
            },
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.refreshTokenMetadata')}
    secondaryText={localize('general.refreshTokenMetadataDescription')}
    onClick={onRefreshTokenMetadataClick}
/>
