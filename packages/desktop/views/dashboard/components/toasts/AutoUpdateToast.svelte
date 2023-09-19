<script lang="ts">
    import { SidebarToast } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    const localeKey = 'views.dashboard.toasts.update'

    let open: boolean = true
    function onClick(): void {
        open = false
    }
</script>

<SidebarToast
    color="green"
    header={localize(`${localeKey}.header`)}
    body={localize(`${localeKey}.body`)}
    button={{
        text: localize(`${localeKey}.button`),
        onClick,
    }}
    {open}
/>
