<script lang="ts">
    import { Button, Icon, IconName, Text } from '@bloomwalletio/ui'
    import { Mnemonic, getWordChoices, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getOnboardingNetworkTypeFromNetworkId } from '@core/network'
    import features from '@features/features'
    import { RecoveryPhrase } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'

    const networkId = $onboardingProfile?.network?.id
    const networkType = getOnboardingNetworkTypeFromNetworkId(networkId)

    const VERIFICATION_WORD_COUNT = 24
    const LOCALE_KEY = 'views.onboarding.createFromMnemonic.verifyMnemonic'

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

    const recoveryPhrase = $onboardingProfile?.mnemonic
    const verificationIndexes: number[] = generateVerificationIndexes(VERIFICATION_WORD_COUNT, recoveryPhrase.length)
    let verifiedRecoveryPhrase: Mnemonic = recoveryPhrase.slice(
        0,
        verificationIndexes[0] > 0 ? verificationIndexes[0] : 0
    )
    let wordChoices: [string, string, string, string] = getWordChoices(verificationIndexes[0])
    let choiceError: string = ''
    let chosenWord: string = ''

    function areArraysEqual(a: unknown[], b: unknown[]): boolean {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false
        }
        return true
    }

    $: isComplete = verifiedRecoveryPhrase.length === recoveryPhrase.length
    $: isVerified = areArraysEqual(recoveryPhrase, verifiedRecoveryPhrase)

    let verifyCount = 0
    let verifyIndex: number = verificationIndexes[0]
    function onChoiceClick(word): void {
        chosenWord = word
        if (chosenWord !== recoveryPhrase[verifyIndex]) {
            choiceError = chosenWord
        } else {
            choiceError = ''
            const previousIndex = verifyIndex
            const nextIndex = verificationIndexes[verifyCount + 1]
            const wordsBefore = recoveryPhrase.slice(verifiedRecoveryPhrase.length, previousIndex)
            const wordsAfter = recoveryPhrase.slice(previousIndex + 1, nextIndex)
            verifiedRecoveryPhrase = [...verifiedRecoveryPhrase, ...wordsBefore, chosenWord, ...wordsAfter]
            wordChoices = getWordChoices(nextIndex)
            verifyIndex = nextIndex
            verifyCount++
        }
    }

    function onContinueClick(): void {
        updateOnboardingProfile({
            hasVerifiedMnemonic:
                features?.onboarding?.[networkType]?.newProfile?.softwareProfile?.skipVerification?.enabled ||
                isVerified,
        })
        $createFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $createFromMnemonicRouter.previous()
    }
</script>

<OnboardingLayout
    title={localize(`${LOCALE_KEY}.title`)}
    description={localize(`${LOCALE_KEY}.description`)}
    continueButton={{
        onClick: onContinueClick,
        disabled: !isComplete,
        text: localize('actions.continue'),
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <content slot="content" class="flex flex-col gap-6">
        <RecoveryPhrase {recoveryPhrase} {verifiedRecoveryPhrase} verification />
        {#if !isComplete}
            <div class="flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <Text textColor="secondary">
                        {localize(`${LOCALE_KEY}.matchWord`, { number: verifyIndex + 1 })}
                    </Text>
                    {#if choiceError}
                        <div class="flex justify-center items-center gap-2">
                            <Icon name={IconName.InfoCircle} size="xs" textColor="danger" />
                            <Text type="sm" fontWeight="medium" textColor="danger"
                                >{localize(`${LOCALE_KEY}.noMatch`)}</Text
                            >
                        </div>
                    {/if}
                </div>
                <div class="grid grid-cols-4 gap-2">
                    {#each wordChoices as word}
                        {@const error = choiceError === word && chosenWord === word}
                        {@const selected = chosenWord === word}
                        <button type="button" on:click={() => onChoiceClick(word)} class:error class:selected>
                            <Text type="sm" fontWeight="medium" textColor="current" align="center">{word}</Text>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
        {#if features?.onboarding?.[networkType]?.newProfile?.softwareProfile?.skipVerification?.enabled}
            <Button
                variant="outlined"
                color="warning"
                width="full"
                text={localize('actions.skip')}
                on:click={onContinueClick}
            />
        {/if}
    </content>
</OnboardingLayout>

<style lang="postcss">
    button {
        @apply transition-colors;
        @apply flex flex-row items-center justify-center w-full px-3 py-2 rounded-lg;
        @apply text-primary dark:text-primary-dark active:text-neutral-1;
        @apply bg-transparent hover:bg-surface-brand/10 focus-visible:bg-surface-brand/10 active:bg-surface-brand;
        @apply border border-solid border-stroke dark:border-stroke-dark;

        &.error {
            @apply text-danger dark:text-danger border-danger/20;
        }

        &:not(.error).selected {
            @apply bg-surface-brand border-surface-brand dark:border-surface-brand text-white dark:text-white;
        }
    }
</style>
