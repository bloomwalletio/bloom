<script lang="ts">
    import { Checkbox } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'

    let isDeveloperProfile = $activeProfile?.isDeveloperProfile
    $: updateActiveProfile({ isDeveloperProfile })
</script>

<SettingsSection
    title={localize('views.settings.developerToggle.title')}
    description={localize('views.settings.developerToggle.description')}
>
    <Checkbox
        size="lg"
        textType="base"
        label={localize('actions.enableDeveloperMode')}
        bind:checked={isDeveloperProfile}
    />
</SettingsSection>
