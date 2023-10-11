<script lang="ts">
    import { TooltipIcon, IconName, Text } from '@bloomwalletio/ui'
    import { IPersistedProfile, ProfileType } from '@core/profile'
    import { ProfileAvatarWithBadge } from '@ui'
    import features from '@features/features'
    import { localize } from '@core/i18n'

    export let profile: IPersistedProfile
    export let disabled: boolean = false
    export let onClick: undefined | ((profileId: string) => void) = undefined
    export let updateRequired: boolean = false

    let isHovering = false
    function toggleIsHovering(): void {
        isHovering = !isHovering
    }

    function onProfileClick(): void {
        onClick && onClick(profile.id)
    }
</script>

<button
    type="button"
    class="profile"
    disabled={disabled || !onClick}
    class:cursor-pointer={!!onClick}
    on:click={onProfileClick}
    on:mouseenter={toggleIsHovering}
    on:mouseleave={toggleIsHovering}
>
    <profile-header>
        <badge-container>
            {#if profile.type === ProfileType.Ledger}
                <TooltipIcon icon={IconName.Hardware} size="sm" tooltip={localize('general.ledgerDevice')} />
            {/if}
        </badge-container>
        {#if features.login.profileActions.enabled}
            <button type="button" class="menu"></button>
        {/if}
    </profile-header>
    <div class="relative">
        <ProfileAvatarWithBadge {profile} size="xxl" {updateRequired} shape={isHovering ? 'squircle' : 'circle'} />
    </div>
    <Text type="body2" align="center" truncate>{profile.name}</Text>
</button>

<style lang="postcss">
    .profile {
        @apply duration-300;
        @apply relative flex flex-col items-center justify-center gap-5 p-10;
        @apply border border-solid border-stroke dark:border-stroke-dark rounded-2xl;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply disabled:pointer-events-none disabled:opacity-50;
        transition-property: background-color, border-color, box-shadow;
        width: var(--profile-card-width, 14rem);
        height: var(--profile-card-width, 14rem);

        &:hover,
        &:focus {
            @apply shadow-lg dark:shadow-violet-900/25;
            @apply border-2 border-brand-500;
            @apply bg-surface dark:bg-surface-dark;
        }
    }

    :global(profile-avatar avatar) {
        /* Remove necessity of !important */
        @apply transition-all duration-300 !important;
    }

    :global(profile-avatar nft-avatar avatar img) {
        /* Remove necessity of !important */
        @apply transition-all duration-300 !important;
    }

    badge-container {
        @apply absolute left-6 top-6;
        @apply flex gap-2 text-gray-500 dark:text-gray-100;
    }

    profile-header {
        @apply absolute top-0 flex justify-between items-center w-full px-10 pt-5;
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
