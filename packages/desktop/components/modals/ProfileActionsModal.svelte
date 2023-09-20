<script lang="ts">
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { lockStronghold, logout } from '@core/profile/actions'
    import { activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
    import { routerManager } from '@core/router'
    import { checkOrUnlockStronghold } from '@core/stronghold'
    import { closePopup, popupState } from '@desktop/auxiliary/popup'
    import { DeveloperIndicatorPill, Icon, Modal, ProfileAvatar, Text, TextType, Toggle } from '@ui'
    import { fade } from 'svelte/transition'

    export let modal: Modal = undefined

    const { isStrongholdLocked, shouldOpenProfileModal } = $activeProfile

    let ledgerConnectionText = ''

    $: profileName = $activeProfile?.name
    // used to prevent the modal from closing when interacting with the password popup
    // to be able to see the stronghold toggle change
    $: isPasswordPopupOpen = $popupState?.active && $popupState?.id === 'password'
    $: if ($isActiveLedgerProfile && $ledgerConnectionState) {
        updateLedgerConnectionText()
    }

    function onSettingsClick(): void {
        closePopup()
        $routerManager.openSettings()
        modal?.close()
    }

    function onLogoutClick(): void {
        logout()
    }

    function onStrongholdToggleClick(): void {
        if ($isStrongholdLocked) {
            checkOrUnlockStronghold()
        } else {
            lockStronghold()
        }
    }

    function updateLedgerConnectionText(): void {
        ledgerConnectionText = localize(`views.dashboard.profileModal.hardware.statuses.${$ledgerConnectionState}`)
    }
</script>

<Modal
    bind:this={modal}
    position={{ bottom: '16px', left: '80px' }}
    classes="w-80"
    on:open={() => shouldOpenProfileModal.set(true)}
    disableOnClickOutside={isPasswordPopupOpen}
>
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <ProfileAvatar profile={$activeProfile} size="sm" />
            <div class="flex flex-row items-center space-x-2">
                <Text>{profileName}</Text>
                {#if $activeProfile?.isDeveloperProfile}
                    <DeveloperIndicatorPill />
                {/if}
            </div>
            {#if $isActiveLedgerProfile}
                <Icon icon="ledger" classes="text-gray-900 dark:text-gray-100 w-4 h-4" />
            {/if}
        </div>
        <button
            on:click={onSettingsClick}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="settings" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('views.dashboard.profileModal.allSettings')}
            </Text>
        </button>
        <button
            on:click={onLogoutClick}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="logout" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('views.dashboard.profileModal.logout')}</Text>
        </button>
    </profile-modal-content>
</Modal>
