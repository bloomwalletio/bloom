<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
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
    import { Text, TextType } from '@ui'

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
