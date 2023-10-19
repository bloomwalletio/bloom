<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import { Checkbox, Text } from '@ui'

    let hideNetworkStatistics = $activeProfile?.settings.hideNetworkStatistics

    $: updateActiveProfileSettings({ hideNetworkStatistics })
</script>

<Text type="body2" class="mb-2">{localize('views.settings.networkStatus.title')}</Text>
<Text type="base" secondary class="mb-6">{localize('views.settings.networkStatus.description')}</Text>
<Checkbox label={localize('actions.hideNetworkStatistics')} bind:checked={hideNetworkStatistics} />
