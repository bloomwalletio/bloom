<script lang="ts">
    import { IThirdPartyPersistedProfile, THIRD_PARTY_PROFILE_VERSION, ThirdPartyAppName } from '@auxiliary/third-party'
    import { Icon, IconName, Pill, Text, TextColor, Tile, Tooltip } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getNetworkIdFromOnboardingNetworkType } from '@core/network'
    import { NetworkAvatar } from '@ui'

    export let profile: IThirdPartyPersistedProfile
    export let appName: ThirdPartyAppName
    export let alreadyImported: boolean
    export let needsChrysalisToStardustDbMigration: boolean
    export let hidden: boolean = false
    export let selected: boolean = false
    export let onClick: () => unknown

    $: networkId = getNetworkIdFromOnboardingNetworkType(profile.network?.id)

    $: migrationError = (profile.version ?? 0) < THIRD_PARTY_PROFILE_VERSION[appName]
    $: disabled = needsChrysalisToStardustDbMigration || migrationError
    $: selectable = !(alreadyImported || disabled)

    enum ThirdPartyProfileStatus {
        ReadyToImport = 'readyToImport',
        AlreadyImported = 'alreadyImported',
        NeedsDbMigration = 'needsDbMigration',
        FailedProfileMigration = 'failedProfileMigration',
    }

    interface ThirdPartyProfileStatusIcon {
        name: IconName
        color: TextColor
    }

    $: thirdPartyProfileStatus = getThirdPartyProfileStatus(
        alreadyImported,
        needsChrysalisToStardustDbMigration,
        migrationError
    )

    function getThirdPartyProfileStatus(
        alreadyImported: boolean,
        needsChrysalisToStardustDbMigration: boolean,
        migrationError: boolean
    ): ThirdPartyProfileStatus {
        if (alreadyImported) {
            return ThirdPartyProfileStatus.AlreadyImported
        }
        if (needsChrysalisToStardustDbMigration) {
            return ThirdPartyProfileStatus.NeedsDbMigration
        }
        if (migrationError) {
            return ThirdPartyProfileStatus.FailedProfileMigration
        }
        return ThirdPartyProfileStatus.ReadyToImport
    }

    const THIRD_PARTY_PROFILE_STATUS_ICON: Readonly<Record<ThirdPartyProfileStatus, ThirdPartyProfileStatusIcon>> = {
        [ThirdPartyProfileStatus.ReadyToImport]: {
            name: IconName.SuccessCircle,
            color: 'success',
        },
        [ThirdPartyProfileStatus.AlreadyImported]: {
            name: IconName.SuccessCircle,
            color: 'success',
        },
        [ThirdPartyProfileStatus.NeedsDbMigration]: {
            name: IconName.WarningCircle,
            color: 'warning',
        },
        [ThirdPartyProfileStatus.FailedProfileMigration]: {
            name: IconName.DangerCircle,
            color: 'danger',
        },
    }

    let iconElement: HTMLElement
</script>

{#if !hidden}
    <Tile
        width="full"
        variant="outlined"
        onClick={selectable ? onClick : undefined}
        {disabled}
        {selected}
        surface={1}
        class="items-center"
    >
        <div class="flex justify-center items-center">
            {#if networkId}
                <NetworkAvatar {networkId} networkName={profile.network.name} size="md" showTooltip />
            {/if}
        </div>
        <div class="flex flex-col justify-center flex-1 ml-3">
            <div class="flex gap-2 truncate">
                <Text type="body2">{profile.name}</Text>
                <div>
                    <Pill color="neutral" compact>{appName}</Pill>
                </div>
            </div>
            <Text type="base" fontWeight="medium" textColor="secondary">
                {profile.id}
            </Text>
        </div>
        {#if !selectable}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <icon-container
                bind:this={iconElement}
                on:click|stopPropagation={() => {}}
                class="pointer-events-auto cursor-default"
            >
                <Icon
                    name={THIRD_PARTY_PROFILE_STATUS_ICON[thirdPartyProfileStatus].name}
                    textColor={THIRD_PARTY_PROFILE_STATUS_ICON[thirdPartyProfileStatus].color}
                    size="sm"
                />
            </icon-container>
        {/if}
    </Tile>
    <Tooltip
        anchor={iconElement}
        text={localize(`views.onboarding.importThirdPartyProfiles.importProfiles.tooltips.${thirdPartyProfileStatus}`)}
        event="hover"
    />
{/if}
