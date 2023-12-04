<script lang="ts">
    import { Router } from '@core/router'
    import { EditSelectionDrawer, PermissionSelection } from '../components'

    export let drawerRouter: Router<unknown>

    let checkedMethods: string[] = []
</script>

<EditSelectionDrawer
    {drawerRouter}
    titleLocale="dapps.editPermissions"
    selections={{ methods: checkedMethods }}
    let:persistedNamespaces
    let:requiredNamespaces
    disableContinue={checkedMethods.length === 0}
>
    <PermissionSelection bind:checkedMethods {requiredNamespaces} {persistedNamespaces} />
</EditSelectionDrawer>
