<script lang="ts">
    import { Avatar, NftAvatar } from '@ui'
    import { AvatarSize } from '@ui/enums'
    import { IPersistedProfile } from '@core/profile'

    export let profile: IPersistedProfile
    export let size: AvatarSize = AvatarSize.Large
    export let color: string | undefined = undefined
</script>

<profile-avatar>
    {#if profile?.pfp}
        <NftAvatar {size} nft={profile.pfp} />
    {:else if profile?.name}
        <Avatar {size} {color} text={profile.name} />
    {/if}
</profile-avatar>
