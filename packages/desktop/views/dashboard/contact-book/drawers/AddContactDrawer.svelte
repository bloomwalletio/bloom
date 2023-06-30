<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '@components'
    import { Router } from '@core/router'

    export let drawerRouter: Router<unknown>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.contactBook.addContact.title')} {drawerRouter}>
    <div class="flex flex-col justify-between mb-6">Add contact</div>
</DrawerTemplate>
