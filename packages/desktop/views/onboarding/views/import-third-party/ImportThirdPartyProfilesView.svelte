<script lang="ts">
    import { ThirdPartyAppName, thirdPartyProfiles } from '@auxiliary/third-party'
    import { importThirdPartyProfiles } from '@auxiliary/third-party/actions'
    import { ImportProfileTile } from '@components/index'
    import { localize } from '@core/i18n'
    import OnboardingLayout from '@views/components/OnboardingLayout.svelte'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'
    import { Spinner } from '@bloomwalletio/ui'

    const selectedProfiles: { [profileId: string]: boolean } = {}
    let busy = false

    $: disableContinue = $thirdPartyProfiles
        ? Object.values($thirdPartyProfiles).filter(
              (profile) => selectedProfiles[profile.profile.id] && !profile.alreadyImported
          ).length === 0
        : true

    function onSelectedProfileClick(profileId: string): void {
        if ($thirdPartyProfiles[profileId]) {
            selectedProfiles[profileId] = !selectedProfiles[profileId]
        }
    }

    async function onImportClick(): Promise<void> {
        try {
            busy = true
            await Promise.allSettled(
                Object.values(ThirdPartyAppName).map(async (appName) => {
                    const profiles = Object.values($thirdPartyProfiles)
                        .filter(
                            (profile) =>
                                profile.appName === appName &&
                                !profile.alreadyImported &&
                                selectedProfiles[profile.profile.id]
                        )
                        .map((profile) => profile.profile)

                    await importThirdPartyProfiles(appName, profiles)
                })
            )
            $onboardingRouter.next()
        } catch (error) {
            console.error(error)
        } finally {
            busy = false
        }
    }

    function onSkipClick(): void {
        $onboardingRouter.next()
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.importThirdPartyProfiles.title')}
    description={localize('views.onboarding.importThirdPartyProfiles.description')}
    {busy}
    backButton={{
        text: localize('actions.skip'),
        onClick: onSkipClick,
    }}
    continueButton={{
        text: localize('actions.import'),
        onClick: onImportClick,
        disabled: disableContinue,
    }}
>
    <div slot="content" class="flex flex-col space-y-3">
        <div class="flex flex-col justify-center items-center gap-2 max-h-[392px] overflow-y-scroll">
            {#if Object.keys($thirdPartyProfiles ?? {}).length > 0}
                {#each Object.entries($thirdPartyProfiles) as [thirdPartyProfileId, thirdPartyProfile]}
                    <ImportProfileTile
                        profile={thirdPartyProfile.profile}
                        appName={thirdPartyProfile?.appName}
                        onClick={() => onSelectedProfileClick(thirdPartyProfileId)}
                        selected={selectedProfiles[thirdPartyProfileId]}
                        disabled={thirdPartyProfile?.alreadyImported ||
                            thirdPartyProfile?.needsChrysalisToStardustDbMigration}
                    />
                {/each}
            {:else if $thirdPartyProfiles === undefined}
                <Spinner />
            {:else}
                {localize('views.onboarding.importThirdPartyProfiles.empty')}
            {/if}
        </div>
    </div>
</OnboardingLayout>
