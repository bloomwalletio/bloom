<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { refreshAccountTokensForActiveProfile } from '@core/token/actions'
    import { PopupId, closePopup, openPopup } from '../../lib/auxiliary/popup'

    let menu: Menu | undefined = undefined

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
        menu?.close()
    }

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
                variant: 'danger',
                title: localize('actions.refreshTokenMetadata'),
                alert: { variant: ['warning'], text: localize('general.refreshTokenMetadataHint') },
                confirmText: localize('actions.reset'),
                onConfirm: refreshTokenMetadata,
            },
        })
        menu?.close()
    }
</script>

<token-list-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: IconName.Import,
                title: localize('actions.importErc20Token'),
                onClick: onImportErc20TokenClick,
            },
            {
                icon: IconName.Refresh,
                title: localize('actions.refreshTokenMetadata'),
                onClick: onRefreshTokenMetadataClick,
            },
        ]}
    />
</token-list-menu>
