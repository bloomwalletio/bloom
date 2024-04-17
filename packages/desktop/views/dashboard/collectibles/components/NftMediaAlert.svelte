<script lang="ts">
    import { DownloadErrorType, DownloadWarningType, Nft, NftDownloadOptions } from '@core/nfts'
    import { Alert, Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { addNftsToDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts/actions'

    export let type: DownloadErrorType | DownloadWarningType | undefined
    export let message: string | undefined
    export let nft: Nft

    $: alertText = type === 'generic' ? message : localize(`error.nft.${type}.long`)

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

{#if type === DownloadWarningType.DownloadNotAllowed || type === DownloadWarningType.TooLargeFile}
    <Alert variant="warning" text={alertText} border>
        <div slot="text">
            <Text textColor="secondary">{alertText}</Text>
            <Button variant="text" text={localize('actions.loadAnyway')} on:click={onDownloadClick} />
        </div>
    </Alert>
{:else if type === DownloadErrorType.NotReachable || type === DownloadErrorType.Generic}
    <Alert variant="danger" text={alertText} border>
        <div slot="text">
            <Text textColor="secondary">{alertText}</Text>
            <Button variant="text" text={localize('actions.retry')} on:click={onDownloadClick} />
        </div>
    </Alert>
{:else}
    <Alert variant="warning" text={alertText} border />
{/if}
