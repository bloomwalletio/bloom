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
    let:persistedNamespaces
    let:requiredNamespaces
    let:optionalNamespaces
>
    <NetworkSelection bind:checkedNetworks {requiredNamespaces} {optionalNamespaces} {persistedNamespaces} />
</EditSelectionDrawer>
