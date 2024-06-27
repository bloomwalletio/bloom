<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { time } from '@core/app/stores'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils/constants'
    import { localize } from '@core/i18n'
    import { getTimeDifference } from '@core/utils'

    export let expiryTimestamp: number | undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'
    $: expiryTimeDiff = (expiryTimestamp ?? 0 * MILLISECONDS_PER_SECOND) - $time.getTime()
</script>

{#if expiryTimeDiff <= 0}
    <div class="w-full flex gap-4 px-6 py-1 bg-danger/10">
        <Text type="sm" textColor="danger" class="flex items-center">{localize(`${localeKey}.expired`)}</Text>
    </div>
{:else}
    <div
        class="
            w-full flex justify-between gap-4 px-6 py-1
            {expiryTimeDiff < SECONDS_PER_MINUTE ? 'bg-warning/10' : 'bg-neutral/10'}
        "
    >
        <Text
            type="sm"
            class="flex items-center"
            textColor={expiryTimeDiff < SECONDS_PER_MINUTE ? 'warning' : 'primary'}
        >
            {localize(`${localeKey}.expiresIn`)}
            {getTimeDifference(new Date((expiryTimestamp ?? 0) * MILLISECONDS_PER_SECOND), $time, true)}
        </Text>
    </div>
{/if}
