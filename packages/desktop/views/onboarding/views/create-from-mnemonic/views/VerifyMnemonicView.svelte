<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import { Mnemonic, getWordChoices, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { Icon, RecoveryPhrase, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'

    const VERIFICATION_WORD_COUNT = 6

    const verifyRecoveryPhrase: Mnemonic = []
    const wordElements: HTMLButtonElement[] = []

    let wordChoices: [string, string, string, string] = ['', '', '', '']
    let isVerified: boolean = $onboardingProfile?.hasVerifiedMnemonic

    const verifticationIndexes: number[] = generateVerificationIndexes(
        VERIFICATION_WORD_COUNT,
        $onboardingProfile?.mnemonic.length
    )
    function generateVerificationIndexes(count: number, totalIndexes: number): number[] {
        const randomNumbers: number[] = []

        while (randomNumbers.length < count) {
            const randomNumber = Math.floor(Math.random() * totalIndexes)
            if (!randomNumbers.includes(randomNumber)) {
                randomNumbers.push(randomNumber)
            }
        }

        return randomNumbers.sort((a, b) => a - b)
    }

    let verifyCount = 0
    let verifyIndex: number = 0

    function onChoiceClick(word: string): void {
        verifyRecoveryPhrase[verifyIndex] = word
        if ($onboardingProfile?.mnemonic[verifyIndex] === word) {
            if (verifyCount === VERIFICATION_WORD_COUNT) {
                isVerified = true
                updateOnboardingProfile({ hasVerifiedMnemonic: true })
            } else {
                verifyIndex = verifticationIndexes[verifyCount]
                wordChoices = getWordChoices(verifyIndex)
                verifyCount++
            }
        }
    }

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $createFromMnemonicRouter.previous()
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (!isVerified) {
            switch (event.key) {
                case '1':
                    wordElements[0].click()
                    break
                case '2':
                    wordElements[1].click()
                    break
                case '3':
                    wordElements[2].click()
                    break
                case '4':
                    wordElements[3].click()
                    break
                default:
                    break
            }
        }
    }

    onMount(() => {
        wordChoices = getWordChoices(verifyRecoveryPhrase.length)
    })
</script>

<svelte:window on:keypress={onKeyPress} />

<OnboardingLayout
    title={localize('views.onboarding.profileBackup.verifyMnemonic.title')}
    description={localize('views.onboarding.profileBackup.verifyMnemonic.body')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !isVerified,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <content slot="content" class="block">
        {#if !isVerified}
            <RecoveryPhrase recoveryPhrase={$onboardingProfile?.mnemonic} {verifyRecoveryPhrase} hidden={false} />
            <Text classes="mb-4">
                {localize('views.onboarding.profileBackup.verifyMnemonic.word')} #{verifyIndex + 1}
            </Text>
            <div class="grid grid-cols-4 gap-2">
                {#each wordChoices as word, i}
                    <button
                        type="button"
                        class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-solid items-center justify-between
                        border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700
                        focus:border-gray-500 dark:focus:border-gray-700"
                        on:click={() => onChoiceClick(word)}
                        bind:this={wordElements[i]}
                    >
                        <Text smaller>{`${i + 1}. ${word}`}</Text>
                    </button>
                {/each}
            </div>
        {:else}
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <icon-container class="block bg-green-500 rounded-2xl relative -top-10">
                    <Icon icon={IconEnum.SuccessCheck} classes="text-white" />
                </icon-container>
                <Text type={TextType.h2} classes="mb-5 text-center">
                    {localize('views.onboarding.profileBackup.verifyMnemonic.verified')}
                </Text>
                <Text secondary classes="mb-2">
                    {localize('views.onboarding.profileBackup.verifyMnemonic.verifiedBody')}
                </Text>
            </div>
        {/if}
    </content>
</OnboardingLayout>
