<script lang="ts">
    import { IThirdPartyPersistedProfile } from '@auxiliary/third-party'
    import { Icon, IconName, Pill, Text, Tile, Tooltip } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { getNetworkIdFromOnboardingNetworkType } from '@core/network'
    import { NetworkAvatar } from '@ui'

    export let profile: IThirdPartyPersistedProfile
    export let appName: string
    export let alreadyImported: boolean
    export let needsChrysalisToStardustDbMigration: boolean
    export let hidden: boolean = false
    export let selected: boolean = false
    export let onClick: () => unknown


    $: console.log("profile tile", profile)

    $: networkId = getNetworkIdFromOnboardingNetworkType(profile.network?.id)

    let iconElement: HTMLElement
</script>

{#if !hidden}
    <Tile
        width="full"
        variant="outlined"
        onClick={!alreadyImported ? onClick : undefined}
        disabled={needsChrysalisToStardustDbMigration}
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
        {#if alreadyImported || needsChrysalisToStardustDbMigration}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <icon-container
                bind:this={iconElement}
                on:click|stopPropagation={() => {}}
                class="pointer-events-auto cursor-default"
            >
                <Icon
                    name={alreadyImported ? IconName.SuccessCircle : IconName.WarningCircle}
                    textColor={alreadyImported ? 'success' : 'warning'}
                    size="sm"
                />
            </icon-container>
        {/if}
    </Tile>
    {#if alreadyImported || needsChrysalisToStardustDbMigration}
        <Tooltip
            anchor={iconElement}
            text={localize(
                `views.onboarding.importThirdPartyProfiles.importProfiles.warnings.${alreadyImported ? 'alreadyImported' : 'needsMigration'}`
            )}
            event="hover"
        />
    {/if}
{/if}
