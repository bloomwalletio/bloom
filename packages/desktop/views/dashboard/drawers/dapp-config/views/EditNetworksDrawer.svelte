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
    let:requiredNetworks
    let:optionalNetworks
    disableContinue={checkedNetworks.length === 0}
>
    <NetworkSelection bind:checkedNetworks {requiredNetworks} {optionalNetworks} {persistedSupportedNamespaces} />
</EditSelectionDrawer>
