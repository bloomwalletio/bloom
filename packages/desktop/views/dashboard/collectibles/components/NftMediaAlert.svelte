<script lang="ts">
    import { DownloadErrorType, DownloadWarningType, Nft, NftDownloadOptions } from '@core/nfts'
    import { Alert, Link, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { addNftsToDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts/actions'

    export let type: DownloadErrorType | DownloadWarningType | undefined
    export let message: string | undefined
    export let nft: Nft

    $: variant = Object.values(DownloadErrorType).some((_type) => _type === type) ? 'danger' : 'warning'
    $: alertText = type === 'generic' ? message : localize(`error.nft.${type}.long`)

    const retryableErrors = [
        DownloadErrorType.NotReachable,
        DownloadErrorType.Generic,
        DownloadWarningType.DownloadTooLong,
        DownloadWarningType.DownloadNotAllowed,
        DownloadWarningType.TooLargeFile,
    ]

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
