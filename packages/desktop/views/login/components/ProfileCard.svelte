<script lang="ts">
    import { IconName, Text, TooltipIcon } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IPersistedProfile, ProfileType } from '@core/profile'
    import features from '@features/features'
    import { ProfileAvatarWithBadge } from '@ui'
    import ProfileCardActionsMenu from './ProfileCardActionsMenu.svelte'

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
    {#if profile.type === ProfileType.Ledger}
        <badge-container>
            <TooltipIcon icon={IconName.Hardware} size="sm" tooltip={localize('general.ledgerDevice')} />
        </badge-container>
    {/if}
    {#if features.login.profileActions.enabled}
        <menu-container>
            <ProfileCardActionsMenu {profile} />
        </menu-container>
    {/if}
    <div class="relative">
        <ProfileAvatarWithBadge {profile} size="xxl" {updateRequired} />
    </div>
    <Text type="body2" align="center" truncate>{profile.name}</Text>
</button>

<style lang="postcss">
    .profile {
        @apply z-10;
        @apply duration-300;
        @apply relative flex flex-col items-center justify-center gap-5 p-10;
        @apply border border-solid border-stroke dark:border-stroke-dark rounded-2xl;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply disabled:pointer-events-none disabled:opacity-50;
        transition-property: background-color, border-color, box-shadow, z-index;
        width: var(--profile-card-width, 14rem);
        height: var(--profile-card-width, 14rem);

        &:hover,
        &:focus {
            @apply z-0;
            @apply border-2 border-brand-500;
            @apply bg-surface dark:bg-surface-dark;
            @apply shadow-[-20px_-20px_64px_15px_rgba(137,190,155,0.10),-20px_20px_64px_15px_rgba(195,149,255,0.10),20px_0px_64px_15px_rgba(114,170,255,0.10),0px_12px_32px_-12px_rgba(0,0,0,0.15)];
            @apply dark:shadow-[0px_12px_32px_-12px_rgba(0,0,0,0.5),-10px_-20px_64px_15px_rgba(0,101,255,0.1),10px_20px_64px_15px_rgba(217,43,221,0.05)];
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
        @apply absolute left-4 top-2 py-2;
        @apply flex gap-2 text-gray-500 dark:text-gray-100;
    }

    menu-container {
        @apply absolute right-4 top-2;
        @apply flex gap-2 text-gray-500 dark:text-gray-100;
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
