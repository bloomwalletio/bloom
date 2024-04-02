<script lang="ts">
    import { ThirdPartyAppName, thirdPartyProfiles } from '@auxiliary/third-party'
    import { importThirdPartyProfiles, updateThirdPartyProfilesStore } from '@auxiliary/third-party/actions'
    import { Alert, Spinner, Text } from '@bloomwalletio/ui'
    import { ImportProfileTile, PopupTemplate } from '@components/index'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup/actions'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { importThirdPartyProfilesRouter } from '../import-third-party-profiles.router'
    import { OnboardingRoute, onboardingRoute, onboardingRouter } from '@views/onboarding'
    import { showNotification } from '@auxiliary/notification'

    const LOCALE_NAMESPACE = 'views.onboarding.importThirdPartyProfiles.importProfiles'

    export let selectedApps: { [key in ThirdPartyAppName]?: boolean } = {}
    export let popup: boolean = false

    const selectedProfiles: { [profileId: string]: boolean } = {}

    let busy = false
    let error = ''

    $: disableContinue = $thirdPartyProfiles
        ? Object.values($thirdPartyProfiles).filter(
              (profile) => selectedProfiles[profile.profile.id] && !profile.alreadyImported
          ).length === 0
        : true

    function onSelectedProfileClick(profileId: string): void {
        if ($thirdPartyProfiles?.[profileId]) {
            selectedProfiles[profileId] = !selectedProfiles[profileId]
        }
    }

    async function onImportClick(): Promise<void> {
        try {
            busy = true
            await Promise.allSettled(
                Object.values(ThirdPartyAppName).map(async (appName) => {
                    const profiles = Object.values($thirdPartyProfiles ?? {})
                        .filter(
                            (profile) =>
                                profile.appName === appName &&
                                !profile.alreadyImported &&
                                selectedProfiles[profile.profile.id]
                        )
                        .map((profile) => profile.profile)

                    await importThirdPartyProfiles(appName, profiles)
                })
            )
            showNotification({
                variant: 'success',
                text: localize(`${LOCALE_NAMESPACE}.notifications.success`),
            })
        } catch (error) {
            console.error(error)
        } finally {
            busy = false
            if (popup) {
                closePopup()
            } else if ($onboardingRoute === OnboardingRoute.ImportThirdPartyProfiles) {
                $onboardingRouter.next()
            }
        }
    }

    async function tryUpdateThirdPartyProfilesStore(): Promise<void> {
        try {
            error = ''
            busy = true
            await updateThirdPartyProfilesStore(
                Object.entries(selectedApps)
                    .filter(([, selected]) => selected)
                    .map(([appName]) => appName as ThirdPartyAppName)
            )
        } catch (err) {
            const _err = err as Error
            if (_err.message.match(/LEVEL_ITERATOR_NOT_OPEN/g)) {
                error = localize(`${LOCALE_NAMESPACE}.errors.appIsOpen`)
            } else {
                error = localize(`${LOCALE_NAMESPACE}.errors.unknown`)
            }
            return
        } finally {
            busy = false
        }
    }

    function onCancelClick(): void {
        thirdPartyProfiles.set(undefined)
        $importThirdPartyProfilesRouter.previous()
    }

    onMount(tryUpdateThirdPartyProfilesStore)
</script>

<svelte:component
    this={popup ? PopupTemplate : OnboardingLayout}
    title={localize(`${LOCALE_NAMESPACE}.title`)}
    description={localize(`${LOCALE_NAMESPACE}.description`)}
    {busy}
    backButton={{
        text: localize('actions.back'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize(error ? 'actions.refresh' : 'actions.import'),
        onClick: error ? tryUpdateThirdPartyProfilesStore : onImportClick,
        disabled: !error && disableContinue,
    }}
>
    <div slot="content" class="flex flex-col gap-2 max-h-[392px] overflow-y-auto p-0.5">
        {#if error}
            <Alert variant="danger" text={error} />
        {:else if $thirdPartyProfiles === undefined}
            <Spinner />
        {:else if Object.keys($thirdPartyProfiles ?? {}).length > 0}
            {#each Object.entries($thirdPartyProfiles ?? {}) as [thirdPartyProfileId, thirdPartyProfile]}
                <ImportProfileTile
                    profile={thirdPartyProfile.profile}
                    appName={thirdPartyProfile?.appName}
                    onClick={() => onSelectedProfileClick(thirdPartyProfileId)}
                    selected={selectedProfiles[thirdPartyProfileId]}
                    alreadyImported={thirdPartyProfile?.alreadyImported}
                    needsChrysalisToStardustDbMigration={thirdPartyProfile?.needsChrysalisToStardustDbMigration}
                />
            {/each}
        {:else if $thirdPartyProfiles === undefined}
            <Spinner />
        {:else}
            <Text align="center" type="body1" textColor="secondary">
                {localize(`${LOCALE_NAMESPACE}.empty`)}
            </Text>
        {/if}
    </div>
</svelte:component>
