<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { APP_STAGE, OS, checkForAppUpdate, openUrlInBrowser } from '@core/app'
    import { downloadAppUpdate } from '@core/app/actions'
    import { appUpdateState, appVersionDetails } from '@core/app/stores'
    import { formatDate, localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { onMount } from 'svelte'
    import { PopupTemplate, ButtonProps } from '..'

    const hasAutoUpdate = features.electron.autoUpdate[OS]?.enabled
    const continueButton = getContinueButtonProps()

    let hasClickedDownload = false
    $: hasClickedDownload && $appUpdateState.progress > 0 && closePopup()

    function onDownloadClick(): void {
        downloadAppUpdate()
        hasClickedDownload = true
    }

    function onVisitDownloadsClick(): void {
        openUrlInBrowser('https://bloomwallet.io/')
    }

    function onCloseClick(): void {
        closePopup()
    }

    function getContinueButtonProps(): ButtonProps {
        if (hasAutoUpdate && !$appVersionDetails.upToDate) {
            return {
                onClick: onDownloadClick,
                disabled: $appUpdateState.busy,
                text: localize('actions.updateBloom'),
            }
        } else if (!$appVersionDetails.upToDate) {
            return {
                onClick: onVisitDownloadsClick,
                text: localize('actions.viewDownloads'),
            }
        } else {
            return undefined
        }
    }

    onMount(() => {
        if (process.env.NODE_ENV !== 'development' && !$appUpdateState.busy) {
            checkForAppUpdate()
        }
    })
</script>

<PopupTemplate
    title={localize('popups.appUpdate.title')}
    backButton={{
        text: localize('actions.close'),
        onClick: onCloseClick,
    }}
    {continueButton}
    busy={$appUpdateState.busy}
>
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
                    key: localize('popups.appUpdate.newVersion'),
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
</PopupTemplate>
