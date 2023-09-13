<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { IPersistedProfile } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { NetworkBadge, NftAvatar } from '@ui'

    export let profile: IPersistedProfile
    export let size: (typeof avatarSize)[number] = 'md'
    export let badgeSize: 'xxs' | 'xs' | 'sm' | 'md' = 'sm'
    export let showNetwork: boolean
</script>

<profile-avatar class="relative">
    {#if profile?.pfp}
        <NftAvatar {size} nft={profile.pfp} {...$$restProps} />
    {:else if profile?.name}
        <Avatar {size} backgroundColor={profile.color} text={getInitials(profile.name, 3)} {...$$restProps} />
    {/if}
    {#if showNetwork}
        <NetworkBadge size={badgeSize} networkId={profile.network.id} networkName={profile.network.name} />
    {/if}
</profile-avatar>
