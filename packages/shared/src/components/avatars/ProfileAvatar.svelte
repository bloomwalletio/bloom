<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { IPersistedProfile } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { NftAvatar } from '@ui'

    export let profile: IPersistedProfile
    export let size: (typeof avatarSize)[number] = 'md'
    export let shape: 'circle' | 'squircle' | 'square' = 'circle'
</script>

<profile-avatar class="relative">
    {#if profile?.pfp}
        <NftAvatar {size} nft={profile.pfp} {shape} {...$$restProps} />
    {:else if profile?.name}
        <Avatar {size} backgroundColor={profile.color} text={getInitials(profile.name, 3)} {...$$restProps} />
    {/if}
</profile-avatar>
