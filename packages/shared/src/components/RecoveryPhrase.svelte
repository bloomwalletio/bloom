<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let recoveryPhrase: string[] = []
    export let verifyRecoveryPhrase: string[] | undefined = undefined

    export let disabled: boolean = true
    export let boxed: boolean = false
    export let verification: boolean = false
</script>

{#if recoveryPhrase}
    <div class="relative">
        <recovery-phrase data-label="recovery-phrase" class:boxed>
            {#each new Array(recoveryPhrase.length) as _, i}
                {@const word = verification ? verifyRecoveryPhrase?.[i] ?? recoveryPhrase[i] : recoveryPhrase[i]}
                {@const selected =
                    verifyRecoveryPhrase &&
                    verifyRecoveryPhrase.length === i &&
                    verifyRecoveryPhrase[i - 1] === recoveryPhrase[i - 1]}
                {@const matched = verification ? verifyRecoveryPhrase && verifyRecoveryPhrase[i] : true}
                <recovery-word id="recovery-word-{i}" class:boxed class:disabled class:selected class:matched>
                    {#if selected}
                        <Text type="sm" fontWeight="medium" customColor="neutral-1">{i + 1}</Text>
                    {:else}
                        <Text type="sm" fontWeight="medium" customColor="brand-400">{`${i + 1}. `}</Text>
                        <Text type="sm" fontWeight="medium" textColor="primary">
                            {!matched ? '*****' : word}
                        </Text>
                    {/if}
                </recovery-word>
            {/each}
        </recovery-phrase>
    </div>
{/if}

<style lang="postcss">
    recovery-phrase {
        @apply grid grid-cols-4 w-full mb-8 text-12 max-w-[460px];

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

        &.selected {
            @apply justify-center bg-surface-brand text-white;
        }

        &.matched {
            @apply bg-surface-brand/20;
        }
    }

    recovery-word.boxed {
        @apply p-3 border border-solid border-transparent bg-transparent text-gray-500;

        &.selected {
            @apply rounded border border-solid border-blue-500 bg-blue-50 justify-center;
            @apply dark:bg-blue-300 dark:bg-opacity-10;
        }
    }
</style>
