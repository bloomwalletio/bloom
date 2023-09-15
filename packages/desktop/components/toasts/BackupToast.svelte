<script lang="ts">
    import { SidebarToast } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    const localeKey = 'toasts.backup'
</script>

<SidebarToast
    headerColor="yellow"
    headerText={localize(`${localeKey}.headerText`)}
    bodyText={localize(`${localeKey}.bodyText`)}
    buttonText={localize(`${localeKey}.button`)}
/>
