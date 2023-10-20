<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { DownloadWarningType, INft } from '@core/nfts'
    import { addNftsToDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts/actions'
    import { persistedNftForActiveProfile, selectedAccountNfts } from '@core/nfts/stores'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'

    const options: IOption[] = getMaxMediaSizeOptions()
    let selected: IOption = options.find(
        (option) => option.value === $activeProfile?.settings.maxMediaSizeInMegaBytes.toString()
    )
    $: if (selected) onMaxMediaSizeChange(selected)

    function onMaxMediaSizeChange(option: IOption): void {
        const maxMediaSizeInMegaBytes = parseInt(option.value)

        updateActiveProfileSettings({ maxMediaSizeInMegaBytes })

        const maxMediaSizeInBytes = maxMediaSizeInMegaBytes && maxMediaSizeInMegaBytes * 1024 * 1024
        deleteOrDownloadNfts(maxMediaSizeInBytes)
    }

    function assignMaxMediaSizeOptionLabel(amount: number): string {
        return amount ? amount + ' MB' : localize('general.none')
    }

    function getMaxMediaSizeOptions(): IOption[] {
        return [5, 10, 25, 50, 100, undefined].map((amount) => ({
            value: amount ? amount.toString() : '-',
            label: assignMaxMediaSizeOptionLabel(amount),
        }))
    }

    async function deleteOrDownloadNfts(maxMediaSizeInBytes: number): Promise<void> {
        const nftsToDownload: INft[] = []
        const nftsToDelete: INft[] = []

        Object.keys($persistedNftForActiveProfile ?? {}).forEach((nftId) => {
            const nft = $selectedAccountNfts.find((nft) => nft.id === nftId)
            if (!nft) {
                return
            }

            if (!maxMediaSizeInBytes) {
                nftsToDownload.push(nft)
            }

            const nftSizeInBytes = Number($persistedNftForActiveProfile?.[nftId]?.contentLength)

            if (nftSizeInBytes > maxMediaSizeInBytes) {
                nftsToDelete.push(nft)
            } else if (nftSizeInBytes <= maxMediaSizeInBytes) {
                nftsToDownload.push(nft)
            }
        })

        addNftsToDownloadQueue($selectedAccountIndex, nftsToDownload, true)
        await Promise.all(
            nftsToDelete.map(async (nft) => {
                await Platform.deleteFile(nft.filePath)
                updateNftInAllAccountNfts($selectedAccountIndex, nft.id, {
                    downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.TooLargeFile } },
                })
            })
        )
    }
</script>

<Text type="body2" class="mb-2">
    {localize('views.settings.maxMediaSize.title')}
</Text>
<Text type="base" textColor="secondary" class="mb-6">
    {localize('views.settings.maxMediaSize.description')}
</Text>
<SelectInput bind:selected value={selected.value} {options} />
