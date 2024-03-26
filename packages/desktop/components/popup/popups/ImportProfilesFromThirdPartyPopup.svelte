<script lang="ts">
    import ImportThirdPartyProfilesRouterView from '@views/login/import-third-party-profiles/ImportThirdPartyProfilesRouterView.svelte'
    import {
        ImportThirdPartyProfilesRouter,
        importThirdPartyProfilesRouter,
    } from '@views/login/import-third-party-profiles/import-third-party-profiles.router'

    importThirdPartyProfilesRouter.set(new ImportThirdPartyProfilesRouter())
</script>

<ImportThirdPartyProfilesRouterView />
