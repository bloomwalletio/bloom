<script lang="ts">
    import {
        ImportThirdPartyProfilesRouter,
        importThirdPartyProfilesRouter,
        ImportThirdPartyProfilesRouterView,
    } from '@views/import-third-party-profiles'

    importThirdPartyProfilesRouter.set(new ImportThirdPartyProfilesRouter())
</script>

<ImportThirdPartyProfilesRouterView popup />
