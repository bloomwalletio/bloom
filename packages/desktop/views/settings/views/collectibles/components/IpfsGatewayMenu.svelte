<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { addNftsToDownloadQueue } from '@core/nfts/actions'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let url: string
    export let isPrimary: boolean = false

    let menu: Menu | undefined = undefined

    function onTogglePrimaryClick(): void {
        const ipfsGateways = $activeProfile?.settings.nfts.ipfsGateways.map((gateway) => ({
            ...gateway,
            isPrimary: gateway.url === url,
        }))
        updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, ipfsGateways } })
        void addNftsToDownloadQueue($selectedAccountNfts)
        menu?.close()
    }

    function onRemoveClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                variant: 'danger',
                title: localize('views.settings.ipfsGateways.removeConfirmation.title'),
                description: localize('views.settings.ipfsGateways.removeConfirmation.description'),
                confirmText: localize('actions.remove'),
                onConfirm: () => {
                    const ipfsGateways = $activeProfile?.settings.nfts.ipfsGateways.filter(
                        (gateway) => gateway.url !== url
                    )
                    updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, ipfsGateways } })
                    closePopup()
                },
            },
        })
        menu?.close()
    }
</script>

<node-actions-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: isPrimary && url ? IconName.BookmarkX : IconName.BookmarkCheck,
                title: localize('views.settings.ipfsGateways.setAsPrimary'),
                disabled: isPrimary,
                onClick: onTogglePrimaryClick,
            },
            {
                icon: IconName.Trash,
                title: localize('actions.remove'),
                variant: 'danger',
                disabled: isPrimary || $activeProfile?.settings.nfts.ipfsGateways.length === 1,
                onClick: onRemoveClick,
            },
        ]}
    />
</node-actions-menu>
