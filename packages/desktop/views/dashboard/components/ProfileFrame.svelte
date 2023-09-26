<script lang="ts">
    import { Indicator, Text } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'
    import { ProfileActionsModal } from '@components'
    import { Modal, ProfileAvatar } from '@ui'

    export let collapsed = false
    let profileModal: Modal

    const { shouldOpenProfileModal } = $activeProfile
</script>

<frame class="">
    <button on:click={profileModal?.open} class:collapsed>
        {#if !collapsed}
            <Text>{$activeProfile.name}</Text>
        {/if}
        <div class="relative">
            <ProfileAvatar profile={$activeProfile} />
            {#if !$shouldOpenProfileModal}
                <Indicator size="sm" color="red" border="white" class="absolute top-0 right-0" />
            {/if}
        </div>
    </button>
</frame>
<ProfileActionsModal bind:modal={profileModal} />

<style lang="postcss">
    frame {
        @apply flex-none w-full h-16 justify-center items-center;
        @apply border-t border-solid border-stroke;
    }

    button {
        @apply flex justify-between items-center;
        @apply w-full h-full px-7;
        @apply hover:bg-purple-100;

        &.collapsed {
            @apply justify-center px-0;
        }
    }
</style>
