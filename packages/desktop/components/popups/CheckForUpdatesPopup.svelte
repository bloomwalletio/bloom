<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, Text, TextType } from '@ui'
    import { Alert, Table } from '@bloomwalletio/ui'
    import { APP_STAGE, OS, checkForAppUpdate, openUrlInBrowser } from '@core/app'
    import { downloadAppUpdate } from '@core/app/actions'
    import { appUpdateState, appVersionDetails } from '@core/app/stores'
    import { formatDate, localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'

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
        <Table
            items={[
                {
                    key: localize('popups.appUpdate.installedVersion'),
                    value: $appVersionDetails.currentVersion,
                },
                {
                    key: localize('popups.appUpdate.stage'),
                    value: localize(`popups.appUpdate.${APP_STAGE}`),
                },
            ]}
        />
        {#if $appVersionDetails.upToDate}
            <Alert variant="success" text={localize('popups.appUpdate.latestInstalled')} />
        {:else}
            <Table
                items={[
                    {
                        key: localize('popups.appUpdate.newVerion'),
                        value: $appVersionDetails.newVersion,
                    },
                    {
                        key: localize('popups.appUpdate.releasedAt'),
                        value: formatDate($appVersionDetails.newVersionReleaseDate, {
                            dateStyle: 'long',
                            timeStyle: 'medium',
                        }),
                    },
                ]}
            />
            <Alert
                variant="info"
                text={localize(`popups.appUpdate.${hasAutoUpdate ? 'updateAvailable' : 'updatesDisabled'}`)}
            />
        {/if}
    </div>

    <div class="flex flex-row justify-center w-full space-x-4">
        <Button classes={$appVersionDetails.upToDate ? 'w-full' : 'w-1/2'} outline onClick={onCloseClick}>
            {localize('actions.cancel')}
        </Button>
        {#if hasAutoUpdate && !$appVersionDetails.upToDate}
            <Button classes="w-1/2" onClick={onDownloadClick} disabled={$appUpdateState.busy}>
                {localize('actions.updateBloom')}
            </Button>
        {:else if !$appVersionDetails.upToDate}
            <Button classes="w-1/2" onClick={onVisitDownloadsClick}>
                {localize('actions.viewDownloads')}
            </Button>
        {/if}
    </div>
</div>
