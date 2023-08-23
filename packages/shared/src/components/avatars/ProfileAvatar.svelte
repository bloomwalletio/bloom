<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { IPersistedProfile } from '@core/profile'
    import { getInitials } from '@core/utils'
    import { NftAvatar } from '@ui'

    export let profile: IPersistedProfile
    export let size: (typeof avatarSize)[number] = 'md'
</script>

<profile-avatar>
    {#if profile?.pfp}
        <NftAvatar {size} nft={profile.pfp} />
    {:else if profile?.name}
        <Avatar {size} color={profile.color} text={getInitials(profile.name, 3)} />
    {/if}
</profile-avatar>
