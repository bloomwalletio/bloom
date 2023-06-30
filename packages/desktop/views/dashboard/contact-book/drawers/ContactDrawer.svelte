<script lang="ts">
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'

    export let drawerRouter: Router<unknown>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.contactBook.contact.title')} {drawerRouter}>
    <div class="flex flex-col justify-between mb-6">Contact</div>
</DrawerTemplate>
