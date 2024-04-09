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
    import { onboardingRouter } from '@views/onboarding'

    const LOCALE_NAMESPACE = 'views.onboarding.importThirdPartyProfiles.selectApps'

    export let selectedApps: { [key in ThirdPartyAppName]?: boolean } = {}
    export let popup: boolean = false

    let availableApps: ThirdPartyAppName[] = []

    function onCancelClick() {
        closePopup()
    }

    function onSkipClick() {
        $onboardingRouter.next()
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
    title={popup ? localize(`${LOCALE_NAMESPACE}.title`) : localize(`${LOCALE_NAMESPACE}.onboardingTitle`)}
    description={popup
        ? localize(`${LOCALE_NAMESPACE}.description`)
        : localize(`${LOCALE_NAMESPACE}.onboardingDescription`)}
    backButton={{
        text: localize(popup ? 'actions.cancel' : 'actions.skip'),
        onClick: popup ? onCancelClick : onSkipClick,
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
                {localize(`${LOCALE_NAMESPACE}.empty`)}
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
