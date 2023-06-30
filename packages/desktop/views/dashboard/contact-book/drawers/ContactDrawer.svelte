<script lang="ts">
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { ContactBookRoute } from '../contact-book-route.enum'

    export let drawerRouter: Router<unknown>
</script>

<DrawerTemplate
    title={localize(`views.dashboard.drawers.contactBook.${ContactBookRoute.Contact}.title`)}
    {drawerRouter}
>
    <div class="flex flex-col justify-between mb-6">Contact</div>
</DrawerTemplate>
