<script lang="ts">
    import { avatarSize } from '@bloomwalletio/ui'
    import { IPersistedProfile } from '@core/profile'
    import { NetworkBadge, StrongholdBadge } from '@ui'
    import ProfileAvatar from './ProfileAvatar.svelte'

    export let profile: IPersistedProfile
    export let updateRequired: boolean = false
    export let size: (typeof avatarSize)[number] = 'md'

    const BADGE_SIZES: { [key: string]: 'xxs' | 'xs' | 'sm' | 'md' } = {
        ['xl']: 'md',
        ['lg']: 'sm',
        ['md']: 'sm',
        ['sm']: 'xs',
        ['xs']: 'xxs',
        ['xxs']: 'xxs',
    }
</script>

<div class="relative">
    <ProfileAvatar {profile} {size} />
    {#if updateRequired}
        <StrongholdBadge size={BADGE_SIZES[size]} />
    {:else}
        <NetworkBadge size={BADGE_SIZES[size]} networkId={profile.network.id} networkName={profile.network.name} />
    {/if}
</div>
