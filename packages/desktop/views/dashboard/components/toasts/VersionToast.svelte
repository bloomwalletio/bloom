<script lang="ts">
    import { Color, SidebarToast } from '@bloomwalletio/ui'
    import { APP_STAGE, AppStage } from '@core/app'
    import { localize } from '@core/i18n'

    const TOAST_PROPS: { [key in AppStage]: Color } = {
        [AppStage.ALPHA]: 'cyan',
        [AppStage.BETA]: 'sky',
        [AppStage.PROD]: 'blue',
    }
</script>

<SidebarToast
    color={TOAST_PROPS[APP_STAGE]}
    header={localize(`popups.appUpdate.${APP_STAGE}`)}
    body={localize('views.dashboard.toasts.version.body')}
    open
    dismissable={false}
/>
