<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { DownloadWarningType, Nft } from '@core/nfts'
    import { addNftsToDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts/actions'
    import { persistedNftForActiveProfile, selectedAccountNfts } from '@core/nfts/stores'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'

    const options: IOption[] = getMaxMediaSizeOptions()
    let selected: IOption = options.find(
        (option) => option.value === $activeProfile?.settings.nfts.maxMediaSizeInMegaBytes?.toString()
    )

    $: onMaxMediaSizeChange(selected)
    function onMaxMediaSizeChange(option: IOption | undefined): void {
        if (option) {
            const maxMediaSizeInMegaBytes = parseInt(option.value)
            updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, maxMediaSizeInMegaBytes } })
            const maxMediaSizeInBytes = maxMediaSizeInMegaBytes && maxMediaSizeInMegaBytes * 1024 * 1024
            deleteOrDownloadNfts(maxMediaSizeInBytes)
        }
    }

    function assignMaxMediaSizeOptionLabel(amount: number): string {
        return amount ? amount + ' MB' : localize('general.none')
    }

    function getMaxMediaSizeOptions(): IOption[] {
        return [5, 10, 25, 50, 100, undefined].map((amount) => ({
            value: amount ? amount.toString() : 'NaN',
            label: assignMaxMediaSizeOptionLabel(amount),
        }))
    }

    async function deleteOrDownloadNfts(maxMediaSizeInBytes: number): Promise<void> {
        const nftsToDownload: Nft[] = []
        const nftsToDelete: Nft[] = []

        Object.keys($persistedNftForActiveProfile ?? {}).forEach((nftId) => {
            const nft = $selectedAccountNfts.find((nft) => nft.id === nftId)
            if (!nft) {
                return
            }

            if (!maxMediaSizeInBytes) {
                nftsToDownload.push(nft)
            }

            const nftSizeInBytes = Number($persistedNftForActiveProfile?.[nftId]?.downloadMetadata.contentLength)

            if (nftSizeInBytes > maxMediaSizeInBytes) {
                nftsToDelete.push(nft)
            } else if (nftSizeInBytes <= maxMediaSizeInBytes) {
                nftsToDownload.push(nft)
            }
        })

        await addNftsToDownloadQueue(nftsToDownload)
        await Promise.all(
            nftsToDelete.map(async (nft) => {
                await Platform.deleteFile(nft.downloadMetadata?.filePath)
                updateNftInAllAccountNfts(nft.id, {
                    isLoaded: false,
                    downloadMetadata: {
                        ...nft.downloadMetadata,
                        error: undefined,
                        warning: { type: DownloadWarningType.TooLargeFile },
                    },
                })
            })
        )
    }
</script>

<SettingsSection
    title={localize('views.settings.maxMediaSize.title')}
    description={localize('views.settings.maxMediaSize.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.maxMediaSize.input')}
            bind:selected
            value={selected?.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
