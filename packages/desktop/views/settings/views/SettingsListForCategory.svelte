<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { ISetting, isSettingVisible } from '@contexts/settings'
    import { activeProfile, isActiveLedgerProfile } from '@core/profile/stores'
    import { SettingsRoute } from '@core/router'
    import features from '@features/features'
    import { SETTINGS } from './settings.constant'
    import { localize } from '@core/i18n'

    export let category: SettingsRoute

    const { loggedIn } = $activeProfile

    $: visibleSettings =
        (SETTINGS?.[category] as ISetting[])?.filter((setting) =>
            isSettingVisible(
                setting,
                features?.settings?.[category]?.[setting.childRoute]?.enabled,
                $loggedIn,
                $isActiveLedgerProfile
            )
        ) ?? []
</script>

<div class="flex flex-col px-8 pb-8 space-y-5">
    <Text type="h6">
        {localize(`views.settings.${category}.title`)}
    </Text>
    {#each visibleSettings as { component, childRoute, props }}
        <section id={childRoute}>
            <svelte:component this={component} {...props} route={childRoute} />
        </section>
    {/each}
</div>

<style lang="scss">
    section {
        @apply w-full sm:w-3/4 pb-6;
        @apply border-solid border-b border-stroke dark:border-stroke-dark;

        &:last-child {
            @apply border-none;
        }
    }
</style>
