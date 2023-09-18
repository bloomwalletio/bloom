<script lang="ts">
    import { Checkbox } from '@ui'
    import { localize } from '@core/i18n'
    import { toggleLocalPowInClientOptions } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { NetworkSettingsRoute } from '@core/router'
    import SettingsSection from '../SettingsSection.svelte'

    $: clientOptions = $activeProfile?.clientOptions
</script>

<SettingsSection setting={NetworkSettingsRoute.LocalProofOfWork}>
    <Checkbox
        label={localize('actions.localProofOfWork')}
        checked={clientOptions?.localPow}
        onClick={toggleLocalPowInClientOptions}
    />
</SettingsSection>
