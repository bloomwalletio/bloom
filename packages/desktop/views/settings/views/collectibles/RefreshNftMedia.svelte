<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { addNftsToDownloadQueue, stopDownloadingNftMediaFromQueue } from '@core/nfts/actions'
    import { selectedAccountNfts, updateNftForAllAccounts } from '@core/nfts/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import SettingsSection from '../SettingsSection.svelte'

    let isLoading = false

    function onRefreshClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.refreshNftMedia.title'),
                description: localize('actions.refreshNftMedia.description'),
                onConfirm: () => {
                    void refreshNftMedia()
                    closePopup()
                },
            },
        })
    }

    async function refreshNftMedia(): Promise<void> {
        isLoading = true
        try {
            await stopDownloadingNftMediaFromQueue()
            await Promise.all(
                $selectedAccountNfts.map(async (nft) => {
                    if (nft.downloadMetadata?.filePath) {
                        await Platform.deleteFile(nft.downloadMetadata?.filePath)
                    }
                    updateNftForAllAccounts({ id: nft.id, isLoaded: false })
                })
            )
            void addNftsToDownloadQueue($selectedAccountNfts)
        } finally {
            isLoading = false
        }
    }
</script>

<SettingsSection
    title={localize('views.settings.refreshNftMedia.title')}
    description={localize('views.settings.refreshNftMedia.description')}
>
    <Button busy={isLoading} disabled={isLoading} text={localize('actions.refresh')} on:click={onRefreshClick} />
</SettingsSection>
