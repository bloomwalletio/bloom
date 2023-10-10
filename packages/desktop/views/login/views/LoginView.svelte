<script lang="ts">
    import { onDestroy } from 'svelte'
    import { CloseButton, Error, PinInput, Text } from '@bloomwalletio/ui'
    import { Platform, needsToAcceptLatestPrivacyPolicy, needsToAcceptLatestTermsOfService } from '@core/app'
    import { localize } from '@core/i18n'
    import { login, resetActiveProfile } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { loginRouter } from '@core/router'
    import { isValidPin } from '@core/utils'
    import { PopupId, openPopup, popupState } from '@desktop/auxiliary/popup'
    import { ProfileAvatarWithBadge } from '@ui'
    import LoggedOutLayout from '@views/components/LoggedOutLayout.svelte'

    let attempts: number = 0
    let error: string = ''
    let isBusy: boolean = false
    let pinCode: string = ''
    let pinInput: PinInput
    let shake: boolean = false

    const MAX_PINCODE_INCORRECT_ATTEMPTS = 3
    const WAITING_TIME_AFTER_MAX_INCORRECT_ATTEMPTS = 30
    const PINCODE_MAX_LENGTH = 6

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

    $: hasReachedMaxAttempts = attempts >= MAX_PINCODE_INCORRECT_ATTEMPTS
    $: isValidPin(pinCode) && void onSubmit()
    $: pinInput && !$popupState.active && pinInput?.focus()
    $: pinCode && (error = '')

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

        if (timeRemainingBeforeNextAttempt === 1) {
            clearInterval(maxAttemptsTimer)
            error = ''
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
                void login()
                $loginRouter.next()
            } else {
                shake = true
                error = localize('views.login.incorrectPin')
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

<LoggedOutLayout>
    <CloseButton slot="button" on:click={onBackClick} />
    <div class="flex flex-col w-full h-full justify-center items-center">
        <login-container class:shake>
            <profile-container>
                <ProfileAvatarWithBadge profile={$activeProfile} size="xxxl" shape="square" />
            </profile-container>
            {#if hasReachedMaxAttempts}
                <div class="flex flex-col justify-center items-center gap-3">
                    <Text type="h4" align="center">{localize('views.login.maxAttempts.title')}</Text>
                    <text-container class="login-view">
                        <Text type="body2" fontWeight="medium" textColor="secondary">
                            {localize('views.login.maxAttempts.body1')}
                        </Text>
                        <Text type="body2" fontWeight="medium" textColor="danger">
                            {localize('views.login.maxAttempts.body2', {
                                values: { times: MAX_PINCODE_INCORRECT_ATTEMPTS.toString() },
                            })}
                        </Text>
                        <Text type="body2" fontWeight="medium" textColor="secondary">
                            {localize('views.login.maxAttempts.body3')}
                        </Text>
                        <Text type="body2" fontWeight="medium" textColor="brand">
                            {localize('times.second', { values: { time: timeRemainingBeforeNextAttempt.toString() } })}
                        </Text>
                        <Text type="body2" fontWeight="medium" textColor="secondary">
                            {localize('views.login.maxAttempts.body4')}
                        </Text>
                    </text-container>
                </div>
            {:else}
                <div class="flex flex-col gap-6 w-full items-center justify-center flex-grow">
                    <Text type="h5" align="center">{localize('actions.enterYourPin')}</Text>
                    <PinInput
                        bind:this={pinInput}
                        bind:value={pinCode}
                        error={!!error}
                        maxlength={PINCODE_MAX_LENGTH}
                        disabled={hasReachedMaxAttempts || isBusy}
                        glimpse={0}
                        autofocus
                    />
                    <Error {error} />
                </div>
            {/if}
        </login-container>
    </div>
</LoggedOutLayout>

<style lang="postcss">
    .header {
        @apply h-[2.625rem];
    }

    login-container {
        @apply flex flex-col justify-center items-center gap-8 px-8 pb-12;
        @apply border border-solid border-stroke rounded-[2rem];
        @apply bg-surface dark:bg-surface-dark;
        box-shadow: 0px 20px 64px -16px rgba(0, 0, 0, 0.1);
    }

    profile-container {
        @apply flex flex-col w-full items-center flex-grow -mt-20;
    }

    text-container.login-view {
        @apply w-96 text-center;
    }

    login-container > text-container > :global(*) {
        @apply inline;
    }

    login-container.shake :global(input) {
        @apply animate-shake;
    }
</style>
