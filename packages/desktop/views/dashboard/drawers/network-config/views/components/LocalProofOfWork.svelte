<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { toggleLocalPowInClientOptions } from '@core/network'
    import { activeProfile } from '@core/profile/stores'

    $: clientOptions = $activeProfile?.clientOptions
</script>

<div class="flex flex-col space-y-2">
    <Text type="body1">
        {localize('views.dashboard.drawers.networkConfig.networkSettings.localProofOfWork.title')}
    </Text>
    <Text textColor="secondary">
        {localize('views.dashboard.drawers.networkConfig.networkSettings.localProofOfWork.description')}
    </Text>
    <Checkbox
        label={localize('actions.localProofOfWork')}
        checked={clientOptions?.localPow}
        size="md"
        on:click={toggleLocalPowInClientOptions}
    />
</div>
