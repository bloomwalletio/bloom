<script lang="ts">
    import { Text } from '@ui'
    import { english } from '@auxiliary/wordlists'
    import { localize } from '@core/i18n'
    import { verifyMnemonic } from '@core/profile-manager'
    import { debounce } from '@core/utils'
    import { Mnemonic } from '@contexts/onboarding'

    export let value: string
    export let disabled = false
    export let minHeight: number = 168

    let statusMessage = ''
    let content = ''
    let error = false

    function checkMnemonic(words: Mnemonic): string | undefined {
        if (words.length !== 24) {
            return localize('error.backup.phraseWordCount', {
                values: {
                    length: words.length,
                },
            })
        }
        for (let i = 0; i < words.length; i++) {
            const includesWord = english.includes(words[i])
            const includesWordOtherCase = english.includes(words[i].toLowerCase())
            if (!includesWord && includesWordOtherCase) {
                return localize('error.backup.phraseCaseWord', {
                    values: {
                        word: words[i],
                    },
                })
            } else if (!includesWord) {
                return localize('error.backup.phraseUnrecognizedWord', {
                    values: {
                        word: words[i],
                    },
                })
            }
        }
    }

    async function handleKeyDown(): Promise<void> {
        value = ''
        statusMessage = ''
        error = false

        content = content.replace(/\r/g, ' ').replace(/\n/g, ' ').replace(/  +/g, ' ')

        const trimmedContent = content?.trim()

        if (trimmedContent.length >= 3) {
            const words = trimmedContent?.split(/[\s,]+/)
            const mnemonicValidations = checkMnemonic(words)
            if (mnemonicValidations) {
                statusMessage = mnemonicValidations
                error = true
            } else {
                try {
                    await verifyMnemonic(trimmedContent)
                    statusMessage = localize('views.onboarding.profileRecovery.importMnemonicPhrase.phraseDetected')
                    value = trimmedContent
                } catch (err) {
                    error = true
                    console.error(err)
                    statusMessage = localize(err.error)
                }
            }
        }
    }
</script>

<div>
    <!-- svelte-ignore a11y-autofocus -->
    <textarea
        {disabled}
        bind:value={content}
        on:input={debounce(handleKeyDown)}
        on:keydown={debounce(handleKeyDown)}
        placeholder=""
        spellcheck={false}
        autofocus
        class:error
        style:min-height="{minHeight}px"
    />
    {#if error}
        <div class="flex flex-row items-start justify-between">
            <Text type="p" secondary {error}>{statusMessage}&nbsp;</Text>
        </div>
    {/if}
</div>

<style lang="scss">
    textarea {
        @apply resize-none w-full p-4 pb-3 rounded-xl bg-white dark:bg-gray-800;
        @apply text-14 leading-140 text-primary font-semibold;
        @apply border border-solid border-stroke dark:border-stroke-dark;

        &.error {
            @apply border-danger-300 hover:border-danger-500 focus:border-danger-500;
        }

        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>
