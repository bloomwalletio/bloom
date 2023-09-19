<script lang="ts">
    import { Indicator, Text } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'
    import { ProfileActionsModal } from '@components'
    import { appVersionDetails } from '@core/app/stores'
    import { Modal, ProfileAvatar } from '@ui'

    let profileModal: Modal

    const { shouldOpenProfileModal } = $activeProfile
</script>

<profile-frame>
    <button class="flex w-full items-center justify-between rounded-full" on:click={profileModal?.open}>
        <Text weight="semibold">{$activeProfile.name}</Text>
        <div class="relative">
            <ProfileAvatar profile={$activeProfile} />
            {#if !$shouldOpenProfileModal && !$appVersionDetails.upToDate}
                <Indicator size="sm" color="red" border="white" class="absolute top-0 right-0" />
            {/if}
        </div>
    </button>
    <ProfileActionsModal bind:modal={profileModal} />
</profile-frame>

<style lang="postcss">
    profile-frame {
        @apply flex justify-between;
        @apply px-7 py-4;
        border-top: 1px solid #f1eef9;
    }
</style>
