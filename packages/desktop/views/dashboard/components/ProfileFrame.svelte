<script lang="ts">
    import { Indicator, Text } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'
    import { ProfileActionsModal } from '@components'
    import { Modal, ProfileAvatar } from '@ui'

    let profileModal: Modal

    const { shouldOpenProfileModal } = $activeProfile
</script>

<profile-frame>
    <button on:click={profileModal?.open}>
        <Text>{$activeProfile.name}</Text>
        <div class="relative">
            <ProfileAvatar profile={$activeProfile} />
            {#if !$shouldOpenProfileModal}
                <Indicator size="sm" color="red" border="white" class="absolute top-0 right-0" />
            {/if}
        </div>
    </button>
</profile-frame>
<ProfileActionsModal bind:modal={profileModal} />

<style lang="postcss">
    profile-frame {
        @apply flex justify-between items-center;
        @apply w-full;
        @apply px-4 py-2;
        /* TODO: remove the hardcoded color when color system is in place */
        border-top: 1px solid #f1eef9;
    }
    button {
        @apply flex justify-between items-center;
        @apply w-full rounded;
        @apply px-3 py-2;
        @apply hover:bg-purple-100;
    }
</style>
