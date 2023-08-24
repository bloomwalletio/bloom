<script lang="ts">
    import { APP_STAGE, OS, checkForAppUpdate, openUrlInBrowser } from '@core/app'
    import { downloadAppUpdate } from '@core/app/actions'
    import { appUpdateState, appVersionDetails } from '@core/app/stores'
    import { formatDate, localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { Button, KeyValueBox, Text, TextHint, TextType } from '@ui'
    import { onMount } from 'svelte'

    let hasAutoUpdate = false

    function onDownloadClick(): void {
        downloadAppUpdate()
        closePopup()
    }

    function onVisitDownloadsClick(): void {
        openUrlInBrowser('https://firefly.iota.org')
    }

    function onCloseClick(): void {
        closePopup()
    }

    onMount(() => {
        if (process.env.NODE_ENV !== 'development') {
            checkForAppUpdate()
        }
        hasAutoUpdate = features.electron.autoUpdate[OS]?.enabled
    })
</script>

<Text type={TextType.h5} classes="mb-5">{localize('popups.appUpdate.title')}</Text>
<div class="flex w-full flex-col space-y-6">
    <div class="flex w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.appUpdate.installedVersion')}
            valueText={$appVersionDetails.currentVersion}
        />
        <KeyValueBox
            keyText={localize('popups.appUpdate.stage')}
            valueText={localize(`popups.appUpdate.${APP_STAGE}`)}
        />
        {#if $appVersionDetails.upToDate}
            <TextHint success classes="w-full" text={localize('popups.appUpdate.latestInstalled')} />
        {:else}
            <KeyValueBox keyText={localize('popups.appUpdate.newVerion')} valueText={$appVersionDetails.newVersion} />
            <KeyValueBox
                keyText={localize('popups.appUpdate.releasedAt')}
                valueText={formatDate($appVersionDetails.newVersionReleaseDate, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })}
            />
            <TextHint
                info
                classes="w-full"
                text={localize(`popups.appUpdate.${hasAutoUpdate ? 'updateAvailable' : 'updatesDisabled'}`)}
            />
        {/if}
    </div>

    <div class="flex flex-row justify-center w-full space-x-4">
        <Button classes={$appVersionDetails.upToDate ? 'w-full' : 'w-1/2'} outline onClick={onCloseClick}
            >{localize('actions.cancel')}</Button
        >
        {#if hasAutoUpdate && !$appVersionDetails.upToDate}
            <Button classes="w-1/2" onClick={onDownloadClick} disabled={$appUpdateState.busy}>
                {localize('actions.updateFirefly')}
            </Button>
        {:else if !$appVersionDetails.upToDate}
            <Button classes="w-1/2" onClick={onVisitDownloadsClick}>
                {localize('actions.viewDownloads')}
            </Button>
        {/if}
    </div>
</div>
