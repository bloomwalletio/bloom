<script lang="ts">
    import { Error, TextArea } from '@bloomwalletio/ui'
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
    <TextArea
        bind:value={content}
        on:input={debounce(handleKeyDown)}
        on:keydown={debounce(handleKeyDown)}
        {disabled}
        {minHeight}
        error={error ? statusMessage : ''}
        autofocus
    />
    {#if error}
        <Error error={statusMessage} />
    {/if}
</div>
