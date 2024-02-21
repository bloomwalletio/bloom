<script lang="ts">
    import { Color, Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let strength: 0 | 1 | 2 | 3 | 4 | undefined = undefined

    const STRENGTH_COLORS_MAP: Record<number, [Color, string]> = {
        0: ['danger', 'bg-danger'],
        1: ['orange', 'bg-orange'],
        2: ['warning', 'bg-warning'],
        3: ['info', 'bg-info'],
        4: ['success', 'bg-success'],
    }
    const STRENGTH_LEVELS = 4
</script>

{#if strength !== undefined}
    <strength-meter>
        <text-container>
            <Text>{localize('general.passwordStrength')}</Text>
            <Pill color={STRENGTH_COLORS_MAP[strength][0]}>
                {localize(`general.passwordStrength${strength}`).toLocaleUpperCase()}
            </Pill>
        </text-container>
        <strength-block-container class:ghost={strength === 0}>
            {#each Array(STRENGTH_LEVELS) as _, i}
                <strength-block class={STRENGTH_COLORS_MAP[strength > i ? i + 1 : 0][1]} class:ghost={strength <= i} />
            {/each}
        </strength-block-container>
    </strength-meter>
{/if}

<style lang="postcss">
    strength-meter {
        @apply flex flex-row justify-between items-center;
    }

    text-container {
        @apply flex flex-row items-center gap-3;
    }

    strength-block-container {
        @apply flex flex-row justify-end gap-1;
    }

    strength-block {
        @apply rounded-[0.625rem] w-10 h-1;

        &.ghost {
            @apply opacity-30;
        }
    }
</style>
