<script lang="ts">
    import { Router } from '@core/router'
    import { EditSelectionDrawer, NetworkSelection } from '../components'

    export let drawerRouter: Router<unknown>

    let checkedNetworks: string[] = []
</script>

<EditSelectionDrawer
    {drawerRouter}
    titleLocale="dapps.editNetworks"
    selections={{ chains: checkedNetworks }}
    let:persistedSupportedNamespaces
    let:requiredNamespaces
    let:optionalNamespaces
    disableContinue={checkedNetworks.length === 0}
>
    <NetworkSelection
        bind:checkedNetworks
        {requiredNamespaces}
        {optionalNamespaces}
        supportedNamespaces={persistedSupportedNamespaces}
    />
</EditSelectionDrawer>
