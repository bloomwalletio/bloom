<script lang="ts">
    import { DownloadErrorType, DownloadWarningType, IDownloadMetadata, Nft, NftDownloadOptions } from '@core/nfts'
    import { Alert, Link, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { addNftsToDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts/actions'
    import { getFormattedFileSize } from '@core/utils'

    export let type: DownloadErrorType | DownloadWarningType | undefined
    export let message: string | undefined
    export let downloadMetadata: IDownloadMetadata
    export let nft: Nft

    let alertText = ''
    $: type, message, (alertText = getAlertText())
    $: variant = Object.values(DownloadErrorType).some((_type) => _type === type) ? 'danger' : 'warning'

    const retryableErrors = [
        DownloadErrorType.NotReachable,
        DownloadErrorType.Generic,
        DownloadWarningType.DownloadTooLong,
        DownloadWarningType.DownloadNotAllowed,
        DownloadWarningType.TooLargeFile,
    ]

    function getAlertText(): string {
        switch (type) {
            case DownloadErrorType.Generic:
                return message ?? ''
            case DownloadErrorType.NotReachable:
                return downloadMetadata.responseCode + ' ' + message
            case DownloadErrorType.NotMatchingFileTypes:
                return localize('error.nft.notMatchingFileTypes.long', {
                    expected: downloadMetadata.contentType,
                    actual: nft.metadata?.type,
                })
            case DownloadWarningType.TooLargeFile:
                return (
                    localize(`error.nft.${type}.long`) +
                    ` - ${getFormattedFileSize(Number(downloadMetadata.contentLength ?? 0))}`
                )
            default:
                return localize(`error.nft.${type}.long`)
        }
    }
    function onDownloadClick(): void {
        let options: Partial<NftDownloadOptions> = {}

        switch (type) {
            case DownloadWarningType.DownloadNotAllowed:
                options = { skipDownloadSettingsCheck: true }
                break
            case DownloadWarningType.TooLargeFile:
                options = { skipDownloadSettingsCheck: true, skipSizeCheck: true }
                break
            default:
                break
        }

        updateNftInAllAccountNfts(nft.id, {
            isLoaded: false,
            downloadMetadata: { ...nft.downloadMetadata, warning: undefined, error: undefined },
        })
        addNftsToDownloadQueue([nft], options)
    }
</script>

{#if retryableErrors.some((_type) => _type === type)}
    <Alert {variant} text={alertText} border>
        <div slot="text">
            <Text textColor="secondary">
                {alertText}
                <Link
                    on:click={onDownloadClick}
                    text={localize(
                        `actions.${type === DownloadWarningType.DownloadNotAllowed || type === DownloadWarningType.TooLargeFile ? 'loadAnyway' : 'retry'}`
                    )}
                />
            </Text>
        </div>
    </Alert>
{:else}
    <Alert {variant} text={alertText} border />
{/if}
