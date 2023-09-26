<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'
    import { ProfileActionsMenu } from '@components'
    import { ProfileAvatar } from '@ui'

    export let collapsed = false
</script>

<profile-frame>
    <ProfileActionsMenu>
        <profile-menu class:collapsed>
            {#if !collapsed}
                <Text>{$activeProfile.name}</Text>
            {/if}
            <div class="relative">
                <ProfileAvatar profile={$activeProfile} />
            </div>
        </profile-menu>
    </ProfileActionsMenu>
</profile-frame>

<style lang="postcss">
    profile-frame {
        @apply flex-none w-full h-16 justify-center items-center;
        @apply border-t border-solid border-stroke;
    }
    profile-menu {
        @apply flex justify-between items-center;
        @apply w-full rounded;
        @apply px-3 py-2;
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;

        &.collapsed {
            @apply justify-center px-0;
        }
    }
</style>
