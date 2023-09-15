<script lang="ts">
    import { Button, Error, IconName, PinInput, Text, Alert } from '@bloomwalletio/ui'
    import {
        Platform,
        isLatestStrongholdVersion,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { login, resetActiveProfile } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { loginRouter } from '@core/router'
    import { isValidPin } from '@core/utils'
    import { PopupId, openPopup, popupState } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { onDestroy } from 'svelte'
    import { ProfileAvatarWithBadge } from '@ui'

    let attempts: number = 0
    let pinCode: string = ''
    let isBusy: boolean = false
    let shake: boolean = false
    let pinInput: PinInput

    /** Maximum number of consecutive (incorrect) attempts allowed to the user */
    const MAX_PINCODE_INCORRECT_ATTEMPTS = 3

    /** Waiting time in seconds after which a user should be allowed to enter pin again */
    const WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS = 30

    let timeRemainingBeforeNextAttempt: number = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS
    let maxAttemptsTimer: ReturnType<typeof setTimeout> = null
    let shakeTimeout: ReturnType<typeof setTimeout> = null

    if (needsToAcceptLatestPrivacyPolicy() || needsToAcceptLatestTermsOfService()) {
        openPopup({
            id: PopupId.LegalUpdate,
            hideClose: true,
            preventClose: true,
        })
    }
    $: updateRequired =
        $activeProfile?.type === ProfileType.Software &&
        !isLatestStrongholdVersion($activeProfile?.strongholdVersion) &&
        features.onboarding.strongholdVersionCheck.enabled
    $: hasReachedMaxAttempts = attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS
    $: errorText = hasReachedMaxAttempts
        ? localize('views.login.pleaseWait', { values: { time: timeRemainingBeforeNextAttempt.toString() } })
        : ''
    $: {
        if (isValidPin(pinCode)) {
            void onSubmit()
        }
    }
    $: {
        if (pinInput && !$popupState.active) {
            pinInput?.focus()
        }
    }

    function setShakeTimeout(): void {
        shakeTimeout = setTimeout(() => {
            shake = false
            isBusy = false
            attempts++
            if (attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS) {
                clearInterval(maxAttemptsTimer)
                maxAttemptsTimer = setInterval(attemptCountdown, 1000)
            } else {
                pinInput?.resetAndFocus()
            }
        }, 1000)
    }

    function attemptCountdown(): void {
        if (!hasReachedMaxAttempts) {
            return
        }

        if (timeRemainingBeforeNextAttempt === -1) {
            clearInterval(maxAttemptsTimer)
            attempts = 0
            timeRemainingBeforeNextAttempt = WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS
            pinInput?.resetAndFocus()
        } else {
            timeRemainingBeforeNextAttempt--
        }
    }

    async function onSubmit(): Promise<void> {
        if (!hasReachedMaxAttempts) {
            isBusy = true
            const isVerified = await Platform.PincodeManager.verify($activeProfile?.id, pinCode)
            if (isVerified) {
                if (!updateRequired) {
                    void login()
                }
                $loginRouter.next()
            } else {
                shake = true
                setShakeTimeout()
            }
        }
    }

    function onBackClick(): void {
        if (!hasReachedMaxAttempts) {
            resetActiveProfile()
            $loginRouter.previous()
        }
    }

    onDestroy(() => {
        clearInterval(maxAttemptsTimer)
        clearTimeout(shakeTimeout)
    })
</script>

<enter-pin-view class:shake>
    <button-container class="block mr-auto">
        <Button
            variant="text"
            size="md"
            icon={IconName.ArrowLeft}
            disabled={hasReachedMaxAttempts}
            on:click={onBackClick}
            text={localize('actions.back')}
        />
    </button-container>
    <div>
        <div>
            <ProfileAvatarWithBadge profile={$activeProfile} size="xl" {updateRequired} shape="square" />
            <Text type="h6" align="center" truncate>{$activeProfile.name}</Text>
        </div>

        {#if updateRequired}
            <Alert variant="warning" text={localize('views.login.hintStronghold')} />
        {/if}
        <div>
            <PinInput
                bind:this={pinInput}
                bind:value={pinCode}
                on:submit={onSubmit}
                disabled={hasReachedMaxAttempts || isBusy}
                autofocus
            />
            <Text bold align="center">
                {attempts > 0
                    ? localize('views.login.incorrectAttempts', {
                          values: { attempts: attempts.toString() },
                      })
                    : localize('actions.enterYourPin')}
            </Text>
        </div>
    </div>
    <Error error={errorText} />
</enter-pin-view>

<style lang="scss">
    enter-pin-view {
        @apply flex flex-col w-full h-full items-center bg-slate-100 dark:bg-gray-900 p-12;

        > div {
            @apply flex flex-col gap-12 w-full items-center justify-center flex-grow;

            > div {
                @apply flex flex-col w-full justify-center items-center gap-6;
            }
        }
    }

    :global(enter-pin-view.shake input) {
        @apply animate-shake;
    }
</style>
