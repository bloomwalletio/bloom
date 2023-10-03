<script lang="ts">
    import { localize } from '@core/i18n'
    import { toggleLocalPowInClientOptions } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { Checkbox } from '@ui'

    $: clientOptions = $activeProfile?.clientOptions
</script>

<Checkbox
    label={localize('actions.localProofOfWork')}
    checked={clientOptions?.localPow}
    onClick={toggleLocalPowInClientOptions}
/>
