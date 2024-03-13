<script lang="ts">
    import { IThirdPartyPersistedProfile, ThirdPartyAppName } from '@auxiliary/third-party'
    import { getThirdPartyPersistedProfiles, importThirdPartyProfiles } from '@auxiliary/third-party/actions'
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { ImportProfileTile } from '@components/index'
    import { localize } from '@core/i18n'
    import { profiles } from '@core/profile/stores'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IPersistedProfile } from '@core/profile'

    const appNameOptions: IOption[] = [
        { label: ThirdPartyAppName.Firefly, value: ThirdPartyAppName.Firefly },
        { label: ThirdPartyAppName.FireflyShimmer, value: ThirdPartyAppName.FireflyShimmer },
    ]

    let appNameSelected: IOption = appNameOptions[0]
    let busy = false
    let thirdPartyProfiles: IThirdPartyPersistedProfile[] = []
    let profilesWithInfo: {
        [profileId: string]: {
            thirdPartyProfile: IThirdPartyPersistedProfile
            needsChrysalisToStardustDbMigration: boolean
            alreadyImported: boolean
            selected: boolean
        }
    }

    function onSelectedProfileClick(profileId: string): void {
        if (profilesWithInfo[profileId]) {
            profilesWithInfo[profileId].selected = !profilesWithInfo[profileId].selected
        }
    }

    function onImportClick(): void {
        importThirdPartyProfiles(
            appNameSelected.value as ThirdPartyAppName,
            Object.values(profilesWithInfo)
                .filter((profile) => !profile.alreadyImported && profile.selected)
                .map((profile) => profile.thirdPartyProfile)
        )
    }

    function onCancelClick(): void {
        closePopup()
    }

    async function updateProfiles(appName: ThirdPartyAppName, existingProfiles: IPersistedProfile[]): Promise<void> {
        if (!busy) {
            busy = true
            thirdPartyProfiles = await getThirdPartyPersistedProfiles(appName)
            thirdPartyProfiles?.forEach((thirdPartyProfile) => {
                const alreadyImported = existingProfiles.find(
                    (existingProfile) => existingProfile.id === thirdPartyProfile.id
                )
                const profileWithInfo = {
                    thirdPartyProfile,
                    needsChrysalisToStardustDbMigration:
                        thirdPartyProfile?.needsChrysalisToStardustDbMigration ?? false,
                    alreadyImported: !!alreadyImported,
                    selected: false,
                }
                profilesWithInfo = {
                    ...profilesWithInfo,
                    [thirdPartyProfile.id]: profileWithInfo,
                }
            })
            busy = false
        }
    }
    $: void updateProfiles(appNameSelected.value as ThirdPartyAppName, $profiles)
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
    }}
>
    <SelectInput
        bind:selected={appNameSelected}
        options={appNameOptions}
        label={localize('general.appName')}
        hideValue
    />
    <div class="flex flex-col gap-2 max-h-[392px] overflow-y-scroll">
        {#if thirdPartyProfiles.length > 0}
            {#each thirdPartyProfiles as thirdPartyProfile}
                <ImportProfileTile
                    profile={thirdPartyProfile}
                    onClick={() => onSelectedProfileClick(thirdPartyProfile.id)}
                    selected={profilesWithInfo[thirdPartyProfile.id]?.selected}
                    disabled={profilesWithInfo[thirdPartyProfile.id]?.alreadyImported ||
                        profilesWithInfo[thirdPartyProfile.id]?.needsChrysalisToStardustDbMigration}
                />
            {/each}
        {:else}
            No profiles
        {/if}
    </div>
</PopupTemplate>
