<script lang="ts">
    import { ThirdPartyAppName } from '@auxiliary/third-party'
    import { ImportThirdPartyProfilesRoute } from './import-third-party-profiles-route.enum'
    import { importThirdPartyProfilesRoute } from './import-third-party-profiles.router'
    import { SelectAppsView, ImportProfilesView } from './views'

    export let popup: boolean = false

    let selectedApps: { [key in ThirdPartyAppName]?: boolean }
</script>

{#if $importThirdPartyProfilesRoute === ImportThirdPartyProfilesRoute.SelectApps}
    <SelectAppsView bind:selectedApps {popup} />
{:else if $importThirdPartyProfilesRoute === ImportThirdPartyProfilesRoute.ImportProfiles}
    <ImportProfilesView {selectedApps} {popup} />
{/if}
