<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { IPersistedProfile, ProfileType } from '@core/profile'
    import { NetworkBadge, ProfileAvatar } from '@ui'

    export let profile: IPersistedProfile
    export let updateRequired: boolean = false
    export let onClick: undefined | ((profileId: string) => void) = undefined

    function onProfileClick(): void {
        onClick && onClick(profile?.id)
    }
</script>

<button type="button" class="profile" class:cursor-pointer={!!onClick} on:click={onProfileClick} disabled={!onClick}>
    <profile-header>
        <badge-container>
            {#if profile?.isDeveloperProfile}
                <Icon name={IconName.DeepLink} size="sm" />
            {/if}
            {#if profile?.type === ProfileType.Ledger}
                <Icon name={IconName.Cpu} size="sm" />
            {/if}
        </badge-container>
        <button type="button" class="menu"></button>
    </profile-header>
    <div class="relative">
        <ProfileAvatar {profile} size="lg" />
        <NetworkBadge size="sm" networkId={profile?.network?.id} networkName={profile?.network?.name} />
    </div>
    {#if profile?.name}
        <Text type="h6" align="center" truncate>{profile?.name}</Text>
    {/if}
</button>

<style lang="postcss">
    .profile {
        @apply flex flex-col items-center justify-between;
        @apply px-4 py-6 w-56 h-56;
        @apply border-2 border-solid border-white dark:border-gray-800 rounded-2xl;
        @apply transition-all duration-300;
        @apply hover:shadow-lg dark:hover:shadow-violet-900/25 focus:shadow-lg;
        @apply bg-white/0 hover:bg-white/100 focus:bg-white/100;
        @apply bg-white/0 dark:hover:bg-white/10 dark:focus:bg-white/10;
    }

    :global(profile-avatar avatar) {
        /* Remove necessity of !important */
        @apply transition-all duration-300 rounded-[50%] !important;
    }

    :global(.profile:hover profile-avatar avatar) {
        /* Remove necessity of !important */
        @apply rounded-3xl !important;
    }

    badge-container {
        @apply flex gap-2 text-gray-500 dark:text-gray-100;
    }

    profile-header {
        @apply flex justify-between items-center w-full h-2;
    }

    button.menu {
        @apply relative mx-2;
    }

    button.menu,
    button.menu::before,
    button.menu::after {
        @apply w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-100;
    }

    button.menu::before,
    button.menu::after {
        @apply absolute left-0;
        content: '';
    }

    button.menu::before {
        @apply -top-1.5;
    }

    button.menu::after {
        @apply -bottom-1.5;
    }
</style>
