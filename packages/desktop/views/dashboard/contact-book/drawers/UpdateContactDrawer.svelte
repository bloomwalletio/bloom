<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '@components'
    import { Router } from '@core/router'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.UpdateContact}.title`)}
    {drawerRouter}
>
    <div class="flex flex-col justify-between mb-6">Update contact</div>
</DrawerTemplate>
