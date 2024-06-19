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
    let:persistedSupportedNamespaces
    let:requiredNamespaces
    let:optionalNamespaces
    disableContinue={checkedMethods.length === 0}
>
    <PermissionSelection
        bind:checkedMethods
        {requiredNamespaces}
        {optionalNamespaces}
        supportedNamespaces={persistedSupportedNamespaces}
    />
</EditSelectionDrawer>
