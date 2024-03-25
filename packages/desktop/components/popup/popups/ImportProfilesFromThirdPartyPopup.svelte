<script lang="ts">
    import { ThirdPartyAppName, thirdPartyProfiles } from '@auxiliary/third-party'
    import { importThirdPartyProfiles } from '@auxiliary/third-party/actions'
    import { Spinner } from '@bloomwalletio/ui'
    import { ImportProfileTile } from '@components/index'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { onMount } from 'svelte'
    import { updateThirdPartyProfilesStore } from '@auxiliary/third-party/actions'

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
        } catch (error) {
            console.error(error)
        } finally {
            busy = false
            closePopup()
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(() => {
        void updateThirdPartyProfilesStore()
    })
</script>

<PopupTemplate
    title={localize('popups.importProfilesFromThirdParty.title')}
    {busy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.import'),
        onClick: onImportClick,
        disabled: disableContinue,
    }}
>
    <div class="flex flex-col gap-2 max-h-[392px] overflow-y-auto p-0.5">
        {#if Object.keys($thirdPartyProfiles ?? {}).length > 0}
            {#each Object.entries($thirdPartyProfiles) as [thirdPartyProfileId, thirdPartyProfile]}
                <ImportProfileTile
                    profile={thirdPartyProfile.profile}
                    appName={thirdPartyProfile?.appName}
                    onClick={() => onSelectedProfileClick(thirdPartyProfileId)}
                    selected={selectedProfiles[thirdPartyProfileId]}
                    alreadyImported={thirdPartyProfile?.alreadyImported}
                    needsChrysalisToStardustDbMigration={thirdPartyProfile?.needsChrysalisToStardustDbMigration}
                />
            {/each}
        {:else if $thirdPartyProfiles === undefined}
            <Spinner />
        {:else}
            {localize('popups.importProfilesFromThirdParty.empty')}
        {/if}
    </div>
</PopupTemplate>
