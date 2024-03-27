<script lang="ts">
    import { ThirdPartyAppName } from '@auxiliary/third-party/enums'
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components/popup'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { importThirdPartyProfilesRouter } from '../import-third-party-profiles.router'

    export let selectedApps: { [key in ThirdPartyAppName]?: boolean } = {}
    export let popup: boolean = false

    let availableApps: ThirdPartyAppName[] = []

    function onCancelClick() {
        closePopup()
    }

    function onContinueClick() {
        $importThirdPartyProfilesRouter.next()
    }

    onMount(async () => {
        availableApps = await Platform.getThirdPartyApps()
        selectedApps = availableApps.reduce((acc, app) => {
            acc[app] = false
            return acc
        }, {})
    })
</script>

<svelte:component
    this={popup ? PopupTemplate : OnboardingLayout}
    title={localize('views.onboarding.importThirdPartyProfiles.selectApps.title')}
    description={localize('views.onboarding.importThirdPartyProfiles.selectApps.description')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !Object.values(selectedApps).some((selected) => selected === true),
    }}
>
    <div slot="content" class="flex flex-col gap-4">
        {#if availableApps.length === 0}
            <Text align="center" type="body1" textColor="secondary">
                {localize('views.onboarding.importThirdPartyProfiles.selectApps.empty')}
            </Text>
        {:else}
            {#each availableApps as appName}
                <div class="flex gap-2 items-center">
                    <Checkbox bind:checked={selectedApps[appName]} size="md" />
                    <Text type="body2" textColor="secondary">{appName}</Text>
                </div>
            {/each}
        {/if}
    </div>
</svelte:component>
