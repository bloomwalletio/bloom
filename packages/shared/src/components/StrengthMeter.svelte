<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let strength: 0 | 1 | 2 | 3 | 4 | undefined = undefined

    const STRENGTH_COLORS = ['neutral-4', 'danger-400', 'orange-400', 'warning-400', 'success-400']
    const STRENGTH_LEVELS = 4
</script>

{#if strength !== undefined}
    <strength-meter>
        <text-container>
            <Text>{localize('general.passwordStrength')}:</Text>
            <Text customColor={STRENGTH_COLORS[strength]} transform="uppercase">
                {localize(`general.passwordStrength${strength}`)}
            </Text>
        </text-container>
        <strength-block-container>
            {#each Array(STRENGTH_LEVELS) as _, i}
                <strength-block class="bg-{STRENGTH_COLORS[strength > i ? i + 1 : 0]}" />
            {/each}
        </strength-block-container>
    </strength-meter>
{/if}

<style lang="postcss">
    strength-meter {
        @apply flex flex-row justify-between items-center;
    }

    text-container {
        @apply flex flex-row gap-1;
    }

    strength-block-container {
        @apply flex flex-row justify-end gap-1;
    }

    strength-block {
        @apply rounded-[0.625rem] w-[1.375rem] h-1;
    }
</style>
