<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        addNftsToDownloadQueue,
        stopDownloadingNftMediaFromQueue,
        updateNftInAllAccountNfts,
    } from '@core/nfts/actions'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    let isLoading = false

    function onRefreshClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.refreshNftMedia.title'),
                description: localize('actions.refreshNftMedia.description'),
                onConfirm: () => {
                    refreshNftMedia()
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
                    await Platform.deleteFile(nft.filePath)
                    updateNftInAllAccountNfts($selectedAccountIndex, nft.id, {
                        downloadMetadata: { isLoaded: false },
                    })
                })
            )
            addNftsToDownloadQueue($selectedAccountIndex, $selectedAccountNfts, true)
        } finally {
            isLoading = false
        }
    }
</script>

<Text type="body2" class="mb-2">{localize('views.settings.refreshNftMedia.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.refreshNftMedia.description')}</Text>
<Button busy={isLoading} disabled={isLoading} text={localize('actions.refresh')} on:click={onRefreshClick} />
