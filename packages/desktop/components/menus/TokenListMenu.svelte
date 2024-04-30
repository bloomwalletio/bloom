<script lang="ts">
    import { activeProfileId } from '@core/profile/stores'
    import { showNotification } from '@auxiliary/notification'
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { loadTokensForAllAccountBalances } from '@core/token/actions'
    import { PopupId, closePopup, openPopup } from '../../lib/auxiliary/popup'
    import { fetchEvmBalancesForAllAccounts } from '@core/layer-2'

    let menu: Menu | undefined = undefined

    function onSyncTokensClick(): void {
        fetchEvmBalancesForAllAccounts($activeProfileId as string, true)
        showNotification({
            variant: 'success',
            text: localize('notifications.syncTokens.success'),
        })
        menu?.close()
    }

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
        menu?.close()
    }

    function refreshTokenMetadata(): void {
        loadTokensForAllAccountBalances(true)
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
                icon: IconName.Refresh,
                title: localize('actions.syncTokens'),
                onClick: onSyncTokensClick,
            },
            {
                icon: IconName.Import,
                title: localize('actions.importToken', { values: { type: 'ERC-20' } }),
                onClick: onImportErc20TokenClick,
            },
            {
                icon: IconName.Refresh2,
                title: localize('actions.refreshTokenMetadata'),
                onClick: onRefreshTokenMetadataClick,
            },
        ]}
    />
</token-list-menu>
