<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'

    let isDeveloperProfile = $activeProfile?.isDeveloperProfile
    $: updateActiveProfile({ isDeveloperProfile })
</script>

<Text type="body2" class="mb-2">{localize('views.settings.developerToggle.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.developerToggle.description')}</Text>
<Checkbox size="lg" textType="base" label={localize('actions.enableDeveloperMode')} bind:checked={isDeveloperProfile} />
