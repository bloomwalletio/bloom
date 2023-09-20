<script lang="ts">
    import { SidebarToast } from '@bloomwalletio/ui'
    import { APP_STAGE, AppStage, openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'

    const TOAST_PROPS: { [key in AppStage]: string } = {
        [AppStage.ALPHA]: 'cyan',
        [AppStage.BETA]: 'sky',
        [AppStage.PROD]: 'blue',
    }

    const localeKey = 'views.dashboard.toasts.version'

    function onClick(): void {
        openUrlInBrowser('https://bloomwallet.io')
    }
</script>

<SidebarToast
    color={TOAST_PROPS[APP_STAGE]}
    header={localize(`popups.appUpdate.${APP_STAGE}`)}
    body={localize(`${localeKey}.body`)}
    open
    dismissable={false}
    button={APP_STAGE === AppStage.PROD ? { text: localize(`${localeKey}.button`), onClick } : undefined}
/>
