<script lang="ts">
    import { Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let recoveryPhrase: string[] = []
    export let verifyRecoveryPhrase: string[] | undefined = undefined

    export let hidden: boolean = true
    export let disabled: boolean = true
    export let boxed: boolean = false

    function showRecoveryPhrase(): void {
        hidden = false
    }
</script>

{#if recoveryPhrase}
    <div class="relative">
        <recovery-phrase data-label="recovery-phrase" class:blurred={hidden} class:boxed>
            {#each recoveryPhrase as word, i}
                {@const errored =
                    verifyRecoveryPhrase && verifyRecoveryPhrase[i] && verifyRecoveryPhrase[i] !== recoveryPhrase[i]}
                {@const selected =
                    verifyRecoveryPhrase &&
                    verifyRecoveryPhrase.length === i &&
                    verifyRecoveryPhrase[i - 1] === recoveryPhrase[i - 1]}
                {@const unmatched = verifyRecoveryPhrase && !verifyRecoveryPhrase[i]}
                <recovery-word
                    id="recovery-word-{i}"
                    class:boxed
                    class:disabled
                    class:errored
                    class:selected
                    class:unmatched
                >
                    <Text type="sm" fontWeight="medium" customColor="brand-400">{`${i + 1}. `}</Text>
                    <Text type="sm" fontWeight="medium" textColor="primary">
                        {hidden || errored || unmatched ? '*****' : word}
                    </Text>
                </recovery-word>
            {/each}
        </recovery-phrase>
        {#if hidden}
            <button-container>
                <Button
                    on:click={showRecoveryPhrase}
                    text={localize('views.onboarding.profileBackup.viewMnemonic.revealRecoveryPhrase')}
                />
            </button-container>
        {/if}
    </div>
{/if}

<style lang="postcss">
    button-container {
        @apply flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full justify-center;
    }

    recovery-phrase {
        @apply grid grid-cols-4 w-full mb-8 text-12;
        max-width: 460px;

        &.blurred {
            @apply filter blur-sm;
        }

        &.boxed {
            @apply overflow-y-auto p-3 rounded-2xl border border-solid border-gray-300;
        }

        &:not(.boxed) {
            @apply gap-3;
        }
    }

    recovery-word {
        @apply flex flex-row items-center gap-1;

        &.disabled {
            @apply pointer-events-none;
        }
    }

    recovery-word:not(.boxed) {
        @apply px-2 py-2 rounded-lg bg-surface-2 dark:bg-surface-2-dark;

        &.unmatched {
            @apply filter blur-sm;
        }

        &.errored {
            @apply bg-red-500 filter blur-sm;
        }
    }

    recovery-word.boxed {
        @apply p-3 border border-solid border-transparent bg-transparent text-gray-500;

        &.selected {
            @apply rounded border border-solid border-blue-500 bg-blue-50;
            @apply dark:bg-blue-300 dark:bg-opacity-10;
        }

        &.errored {
            @apply rounded border border-solid border-red-500 bg-red-50;
            @apply dark:bg-red-300 dark:bg-opacity-10;
        }
    }
</style>
