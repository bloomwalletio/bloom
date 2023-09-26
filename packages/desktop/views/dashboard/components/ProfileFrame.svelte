<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'
    import { ProfileActionsMenu } from '@components'
    import { ProfileAvatar } from '@ui'
</script>

<profile-frame>
    <ProfileActionsMenu>
        <profile-menu>
            <Text>{$activeProfile.name}</Text>
            <div class="relative">
                <ProfileAvatar profile={$activeProfile} />
            </div>
        </profile-menu>
    </ProfileActionsMenu>
</profile-frame>

<style lang="postcss">
    profile-frame {
        @apply flex justify-between items-center;
        @apply w-full;
        @apply px-4 py-2;
        @apply border-t border-solid border-stroke dark:border-stroke-dark;
    }
    profile-menu {
        @apply flex justify-between items-center;
        @apply w-full rounded;
        @apply px-3 py-2;
        @apply hover:bg-purple-100 dark:hover:bg-surface-2-dark;
    }
</style>
