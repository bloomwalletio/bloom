<script lang="ts">
    import { IThirdPartyPersistedProfile } from '@auxiliary/third-party'
    import { Icon, IconName, Text, Tile, getHexColorFromColor } from '@bloomwalletio/ui'
    import { OnboardingNetworkType } from '@contexts/onboarding'

    export let profile: IThirdPartyPersistedProfile
    export let disabled: boolean = false
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
</script>

{#if !hidden}
    <Tile width="full" variant="outlined" {onClick} {disabled} {selected} surface={1}>
        <div class="flex justify-center items-center">
            <icon-container
                class="w-12 h-12 flex justify-center items-center rounded-xl"
                style={`background-color: ${background}`}
            >
                <Icon
                    name={NETWORK_ICON_PROPS[profile.network.id]?.icon}
                    customColor={NETWORK_ICON_PROPS[profile.network.id]?.iconColor}
                    size="base"
                />
            </icon-container>
        </div>
        <div class="flex flex-col justify-center flex-1 ml-3">
            <Text type="body2">{profile.name}</Text>
            <Text type="base" fontWeight="medium" textColor="secondary">
                {profile.id}
            </Text>
        </div>
    </Tile>
{/if}
