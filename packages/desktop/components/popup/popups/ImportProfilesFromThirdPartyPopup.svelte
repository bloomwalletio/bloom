<script lang="ts">
    import { IThirdPartyPersistedProfile, ThirdPartyAppName } from '@auxiliary/third-party'
    import { getThirdPartyPersistedProfiles, importThirdPartyProfiles } from '@auxiliary/third-party/actions'
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import PopupTemplate from '../PopupTemplate.svelte'

    const appNameOptions: IOption[] = [
        { label: ThirdPartyAppName.Firefly, value: ThirdPartyAppName.Firefly },
        { label: ThirdPartyAppName.FireflyShimmer, value: ThirdPartyAppName.FireflyShimmer },
    ]

    let appNameSelected: IOption = appNameOptions[0]
    let busy = false
    let profiles: IThirdPartyPersistedProfile[] = []
    let profilesToImport: IThirdPartyPersistedProfile[] = []

    function onImportClick(): void {
        importThirdPartyProfiles(profilesToImport)
    }

    function onCancelClick(): void {
        closePopup()
    }

    async function updateProfiles(appName: ThirdPartyAppName): Promise<void> {
        if (!busy) {
            busy = true
            profiles = await getThirdPartyPersistedProfiles(appName)
            profilesToImport = profiles.filter((profile) => !profile.needsChrysalisToStardustDbMigration)
            busy = false
        }
    }
    $: void updateProfiles(appNameSelected.value as ThirdPartyAppName)
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
    {#if profiles.length > 0}
        {#each profiles as profile}
            <li>{profile.name}</li>
        {/each}
    {:else}
        No profiles
    {/if}
</PopupTemplate>
