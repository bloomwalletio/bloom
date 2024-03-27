<script lang="ts">
    import { ThirdPartyAppName } from '@auxiliary/third-party'
    import { ImportThirdPartyProfilesRoute } from './import-third-party-profiles-route.enum'
    import { importThirdPartyProfilesRoute } from './import-third-party-profiles.router'
    import { SelectAppsView, ImportProfilesView } from './views'

    let selectedApps: { [key in ThirdPartyAppName]?: boolean }
</script>

<send-flow-router>
    {#if $importThirdPartyProfilesRoute === ImportThirdPartyProfilesRoute.SelectApps}
        <SelectAppsView bind:selectedApps />
    {:else if $importThirdPartyProfilesRoute === ImportThirdPartyProfilesRoute.ImportProfiles}
        <ImportProfilesView {selectedApps} />
    {/if}
</send-flow-router>
