<script lang="ts">
    import { IThirdPartyPersistedProfile } from '@auxiliary/third-party'
    import { Icon, IconName, Text, Tile, Tooltip, getHexColorFromColor } from '@bloomwalletio/ui'
    import { OnboardingNetworkType } from '@contexts/onboarding'
    import { localize } from '@core/i18n'

    export let profile: IThirdPartyPersistedProfile
    export let appName: string
    export let alreadyImported: boolean
    export let needsChrysalisToStardustDbMigration: boolean
    export let disabled: boolean = alreadyImported || needsChrysalisToStardustDbMigration
    export let hidden: boolean = false
    export let selected: boolean = false
    export let onClick: () => unknown

    const NETWORK_ICON_PROPS = {
        [OnboardingNetworkType.Iota]: {
            icon: IconName.Iota,
            iconColor: '#ffffff',
            backgroundColor: '#000000',
        },
        [OnboardingNetworkType.Shimmer]: {
            icon: IconName.Shimmer,
            iconColor: 'blue-900',
            backgroundColor: 'shimmer',
        },
        [OnboardingNetworkType.Testnet]: {
            icon: IconName.Beaker,
        },
    }

    const background = getHexColorFromColor(NETWORK_ICON_PROPS[profile.network.id]?.backgroundColor ?? '#000000')

    let iconElement: HTMLElement
</script>

{#if !hidden}
    <Tile width="full" variant="outlined" {onClick} {disabled} {selected} surface={1} class="items-center">
        <div class="flex justify-center items-center">
            <icon-container
                class="w-12 h-12 flex justify-center items-center rounded-xl"
                style:background-color={background}
            >
                <Icon
                    name={NETWORK_ICON_PROPS[profile.network.id]?.icon}
                    customColor={NETWORK_ICON_PROPS[profile.network.id]?.iconColor}
                    size="base"
                />
            </icon-container>
        </div>
        <div class="flex flex-col justify-center flex-1 ml-3">
            <div class="flex gap-1">
                <Text type="body2">{profile.name}</Text>
                <Text type="body2" fontWeight="medium" textColor="secondary">● {appName}</Text>
            </div>
            <Text type="base" fontWeight="medium" textColor="secondary">
                {profile.id}
            </Text>
        </div>
        {#if alreadyImported || needsChrysalisToStardustDbMigration}
            <icon-container bind:this={iconElement} class="pointer-events-auto cursor-default">
                <Icon name={alreadyImported ? IconName.SuccessCircle : IconName.WarningCircle} size="sm" />
            </icon-container>
        {/if}
    </Tile>
    {#if alreadyImported || needsChrysalisToStardustDbMigration}
        <Tooltip
            anchor={iconElement}
            text={localize(
                `views.importThirdPartyProfiles.warnings.${alreadyImported ? 'alreadyImported' : 'needsMigration'}`
            )}
            event="hover"
        />
    {/if}
{/if}
