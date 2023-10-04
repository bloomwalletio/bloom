<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let recoveryPhrase: string[] = []
    export let verifyRecoveryPhrase: string[] | undefined = undefined

    export let disabled: boolean = true
    export let boxed: boolean = false
</script>

{#if recoveryPhrase}
    <div class="relative">
        <recovery-phrase data-label="recovery-phrase" class:boxed>
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
                        {errored || unmatched ? '*****' : word}
                    </Text>
                </recovery-word>
            {/each}
        </recovery-phrase>
    </div>
{/if}

<style lang="postcss">
    recovery-phrase {
        @apply grid grid-cols-4 w-full mb-8 text-12;
        max-width: 460px;

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
