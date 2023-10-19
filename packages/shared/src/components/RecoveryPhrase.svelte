<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let recoveryPhrase: string[] = []
    export let verifiedRecoveryPhrase: string[] | undefined = undefined

    export let disabled: boolean = true
    export let boxed: boolean = false
    export let verification: boolean = false
</script>

{#if recoveryPhrase}
    <div class="relative">
        <recovery-phrase data-label="recovery-phrase">
            {#each new Array(recoveryPhrase.length) as _, i}
                {@const word = verification ? verifiedRecoveryPhrase?.[i] ?? recoveryPhrase[i] : recoveryPhrase[i]}
                {@const selected = verifiedRecoveryPhrase && verifiedRecoveryPhrase.length === i}
                {@const matched = verification && verifiedRecoveryPhrase && verifiedRecoveryPhrase[i]}
                <recovery-word id="recovery-word-{i}" class:disabled class:selected class:matched>
                    {#if selected}
                        <Text type="sm" fontWeight="medium" customColor="neutral-1">{i + 1}</Text>
                    {:else}
                        <Text type="sm" fontWeight="medium" textColor="secondary">{`${i + 1}. `}</Text>
                        <Text type="sm" fontWeight="medium" textColor="primary">
                            {verification ? '• • • • • •' : word}
                        </Text>
                    {/if}
                </recovery-word>
            {/each}
        </recovery-phrase>
    </div>
{/if}

<style lang="postcss">
    recovery-phrase {
        @apply grid grid-cols-4 w-full text-12 max-w-[460px];
        @apply gap-2;
    }

    recovery-word {
        @apply flex flex-row items-center gap-1;
        @apply p-2 rounded-lg;
        @apply rounded-lg border-[1.5px] border-solid border-stroke dark:border-stroke-dark;

        &.disabled {
            @apply pointer-events-none;
        }

        &.selected {
            @apply justify-center bg-surface-brand text-white;
        }

        &.matched {
            @apply border-success/50;
        }
    }
</style>
