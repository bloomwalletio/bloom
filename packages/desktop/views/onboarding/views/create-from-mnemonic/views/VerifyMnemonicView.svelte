<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { Mnemonic, getWordChoices, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { RecoveryPhrase } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'

    const VERIFICATION_WORD_COUNT = 24

    const verifyRecoveryPhrase: Mnemonic = []
    const wordElements: HTMLButtonElement[] = []

    const localeKey = 'views.onboarding.profileBackup.verifyMnemonic'

    let wordChoices: [string, string, string, string] = ['', '', '', '']
    let isVerified: boolean = $onboardingProfile?.hasVerifiedMnemonic ?? false
    let isVerifiedSuccess: boolean = false
    let verifyCount = 0
    let verifyIndex: number = 0

    function onChoiceClick(word: string): void {
        verifyRecoveryPhrase[verifyIndex] = word
        if (verifyCount === VERIFICATION_WORD_COUNT) {
            updateOnboardingProfile({ hasVerifiedMnemonic: true })
        } else {
            verifyIndex++
            wordChoices = getWordChoices(verifyIndex)
            verifyCount++
        }
    }

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $createFromMnemonicRouter.previous()
    }

    function onTryAgainClick(): void {
        verifyRecoveryPhrase.length = 0
        verifyCount = 0
        verifyIndex = 0
        isVerified = false
        isVerifiedSuccess = false
    }

    function arraysEqual(a: unknown[], b: unknown[]): boolean {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false
        }
        return true
    }

    $: if (verifyRecoveryPhrase?.length === $onboardingProfile?.mnemonic.length) {
        isVerified = true
        if (
            !verifyRecoveryPhrase.some((word) => !word) &&
            arraysEqual(verifyRecoveryPhrase, $onboardingProfile?.mnemonic)
        ) {
            isVerifiedSuccess = true
        } else {
            isVerifiedSuccess = false
        }
    }

    $: verificationStatusLocaleKey = isVerifiedSuccess ? 'success' : 'failure'

    let title: string
    $: if (!isVerified) {
        title = localize(`${localeKey}.title`)
    } else {
        title = localize(`${localeKey}.${verificationStatusLocaleKey}.title`)
    }

    onMount(() => {
        wordChoices = getWordChoices(verifyRecoveryPhrase.length)
    })
</script>

<OnboardingLayout
    {title}
    description={isVerified ? undefined : localize(`${localeKey}.body`)}
    continueButton={{
        onClick: isVerified && !isVerifiedSuccess ? onTryAgainClick : onContinueClick,
        disabled: !isVerified,
        text: isVerified && !isVerifiedSuccess ? localize('actions.tryAgain') : localize('actions.continue'),
    }}
    backButton={{
        onClick: onBackClick,
        hidden: isVerified && !isVerifiedSuccess,
    }}
>
    <content slot="content" class="flex flex-col gap-6">
        {#if !isVerified}
            <RecoveryPhrase recoveryPhrase={$onboardingProfile?.mnemonic} {verifyRecoveryPhrase} verification />
            <div class="flex flex-col gap-4">
                <Text textColor="secondary">
                    {localize(`${localeKey}.word`)} #{verifyIndex + 1}: {localize(`${localeKey}.match`)}
                </Text>
                <div class="grid grid-cols-4 gap-2">
                    {#each wordChoices as word, i}
                        <button type="button" on:click={() => onChoiceClick(word)} bind:this={wordElements[i]}>
                            <Text type="sm" fontWeight="medium" textColor="current">{word}</Text>
                        </button>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="flex flex-col items-center border border-solid border-stroke rounded-2xl py-6 px-4 gap-3">
                {#if isVerifiedSuccess}
                    <svg width="76" height="77" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_420_4340)">
                            <path
                                d="M31.9668 3.06426C35.5358 0.364219 40.4642 0.364223 44.0332 3.06426L45.6695 4.30217C47.4593 5.65614 49.6524 6.36873 51.8962 6.32533L53.9476 6.28564C58.4221 6.19908 62.4092 9.09593 63.7096 13.3781L64.3058 15.3414C64.9579 17.4888 66.3133 19.3544 68.154 20.6381L69.837 21.8118C73.5078 24.3718 75.0308 29.059 73.5658 33.2877L72.8941 35.2265C72.1594 37.347 72.1594 39.653 72.8941 41.7735L73.5658 43.7123C75.0308 47.941 73.5078 52.6282 69.837 55.1882L68.154 56.3619C66.3133 57.6456 64.9578 59.5112 64.3058 61.6586L63.7096 63.6219C62.4092 67.9041 58.4221 70.8009 53.9476 70.7144L51.8962 70.6747C49.6524 70.6313 47.4593 71.3439 45.6695 72.6978L44.0332 73.9357C40.4642 76.6358 35.5358 76.6358 31.9668 73.9357L30.3305 72.6978C28.5407 71.3439 26.3476 70.6313 24.1038 70.6747L22.0524 70.7144C17.5779 70.8009 13.5908 67.9041 12.2904 63.6219L11.6942 61.6586C11.0421 59.5112 9.68671 57.6456 7.84595 56.3619L6.16298 55.1882C2.4922 52.6282 0.969239 47.941 2.43424 43.7123L3.10591 41.7735C3.84055 39.653 3.84055 37.347 3.10591 35.2265L2.43424 33.2877C0.969238 29.059 2.4922 24.3718 6.16298 21.8118L7.84595 20.6381C9.68671 19.3544 11.0421 17.4888 11.6942 15.3414L12.2904 13.3781C13.5908 9.09593 17.5779 6.19908 22.0524 6.28564L24.1038 6.32533C26.3476 6.36873 28.5407 5.65614 30.3305 4.30217L31.9668 3.06426Z"
                                fill="#50A361"
                            />
                            <path
                                d="M48.6673 30.5L34.0007 45.1667L27.334 38.5"
                                stroke="white"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_420_4340">
                                <rect y="0.5" width="76" height="76" rx="38" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="81" viewBox="0 0 80 81" fill="none">
                        <path
                            d="M39.9993 73.8332C58.4088 73.8332 73.3327 58.9093 73.3327 40.4998C73.3327 22.0903 58.4088 7.1665 39.9993 7.1665C21.5899 7.1665 6.66602 22.0903 6.66602 40.4998C6.66602 58.9093 21.5899 73.8332 39.9993 73.8332Z"
                            fill="#FFC9A8"
                        />
                        <path
                            d="M53.3327 53.8333C53.3327 53.8333 48.3327 47.1666 39.9993 47.1666C31.666 47.1666 26.666 53.8333 26.666 53.8333"
                            fill="#FFC9A8"
                        />
                        <path
                            d="M56.666 31.3C55.3493 32.9166 53.5493 33.8333 51.666 33.8333C49.7827 33.8333 48.0327 32.9166 46.666 31.3"
                            fill="#FFC9A8"
                        />
                        <path
                            d="M33.3327 31.3C32.016 32.9166 30.216 33.8333 28.3327 33.8333C26.4493 33.8333 24.6993 32.9166 23.3327 31.3"
                            fill="#FFC9A8"
                        />
                        <path
                            d="M53.3327 53.8333C53.3327 53.8333 48.3327 47.1666 39.9993 47.1666C31.666 47.1666 26.666 53.8333 26.666 53.8333M56.666 31.3C55.3493 32.9166 53.5493 33.8333 51.666 33.8333C49.7827 33.8333 48.0327 32.9166 46.666 31.3M33.3327 31.3C32.016 32.9166 30.216 33.8333 28.3327 33.8333C26.4493 33.8333 24.6993 32.9166 23.3327 31.3M73.3327 40.4998C73.3327 58.9093 58.4088 73.8332 39.9993 73.8332C21.5899 73.8332 6.66602 58.9093 6.66602 40.4998C6.66602 22.0903 21.5899 7.1665 39.9993 7.1665C58.4088 7.1665 73.3327 22.0903 73.3327 40.4998Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                {/if}
                <Text type="body2" classes="mb-5 text-center">
                    {localize(`${localeKey}.${verificationStatusLocaleKey}.body1`)}
                </Text>
                <Text type="sm" textColor="secondary">
                    {localize(`${localeKey}.${verificationStatusLocaleKey}.body2`)}
                </Text>
            </div>
        {/if}
    </content>
</OnboardingLayout>

<style lang="postcss">
    button {
        @apply flex flex-row items-center justify-between w-full px-3 py-2 rounded-lg;
        @apply text-primary dark:text-primary-dark active:text-neutral-1;
        @apply bg-transparent hover:bg-surface-brand/10 focus-visible:bg-surface-brand/10 active:bg-surface-brand;
        @apply border border-solid border-stroke dark:border-stroke-dark;
    }
</style>
