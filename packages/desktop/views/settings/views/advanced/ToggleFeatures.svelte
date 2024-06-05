<script lang="ts">
    import { Checkbox, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { DashboardRoute } from '@core/router'
    import SettingsSection from '../SettingsSection.svelte'
    import { isFeatureNotGeoFenced, isFeatureNotGeoFenced } from '@lib/features/utils'

    const features = $activeProfile?.features ?? {
        [DashboardRoute.Wallet]: true,
        [DashboardRoute.Collectibles]: true,
        [DashboardRoute.Governance]: true,
        [DashboardRoute.Campaigns]: true,
        [DashboardRoute.BuySell]: true,
        [DashboardRoute.Developer]: false,
    }

    $: updateActiveProfile({ features })
</script>

<SettingsSection
    title={localize('views.settings.toggleFeatures.title')}
    description={localize('views.settings.toggleFeatures.description')}
>
    <div class="space-y-2">
        <Checkbox
            size="md"
            textType="base"
            label={localize('tabs.wallet')}
            disabled
            bind:checked={features[DashboardRoute.Wallet]}
        />
        <Checkbox
            size="md"
            textType="base"
            label={localize('tabs.collectibles')}
            bind:checked={features[DashboardRoute.Collectibles]}
        />
        <Checkbox
            size="md"
            textType="base"
            label={localize('tabs.governance')}
            bind:checked={features[DashboardRoute.Governance]}
        />
        <Checkbox
            size="md"
            textType="base"
            label={localize('tabs.campaigns')}
            bind:checked={features[DashboardRoute.Campaigns]}
        />
        {#if isFeatureNotGeoFenced(DashboardRoute.BuySell)}
            <Checkbox
                size="md"
                textType="base"
                label={localize('tabs.buySell')}
                bind:checked={features[DashboardRoute.BuySell]}
            />
        {/if}
        <div class="flex flex-row space-x-2 items-center">
            <Checkbox
                size="md"
                textType="base"
                label={localize('tabs.developer')}
                bind:checked={features[DashboardRoute.Developer]}
            />
            <div>
                <Pill compact color="sky">{localize('popups.appUpdate.beta')}</Pill>
            </div>
        </div>
    </div>
</SettingsSection>
