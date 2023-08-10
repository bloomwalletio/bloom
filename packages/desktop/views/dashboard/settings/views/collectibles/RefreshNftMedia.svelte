<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import {
        addNftsToDownloadQueue,
        selectedAccountNfts,
        stopDownloadingNftMediaFromQueue,
        updateNftInAllAccountNfts,
    } from '@core/nfts'
    import { Platform } from '@core/app'
    import { selectedAccountIndex } from '@core/account'

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

<Text type={TextType.h4} classes="mb-3">{localize('views.settings.refreshNftMedia.title')}</Text>
<Text secondary classes="mb-5">{localize('views.settings.refreshNftMedia.description')}</Text>
<div class="flex flex-row items-center">
    <Button busy={isLoading} disabled={isLoading} text={localize('actions.refresh')} on:click={onRefreshClick} />
</div>
