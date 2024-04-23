<script lang="ts">
    import { localize } from '@core/i18n'
    import { ActivityDirection } from '@core/activity'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'

    export let direction: ActivityDirection = ActivityDirection.Incoming
    export let timeDiff: string
</script>

{#if timeDiff !== ''}
    <Pill
        color="warning"
        compact
        tooltip={localize(`pills.asyncStatus.${direction === ActivityDirection.Outgoing ? 'unclaimed' : 'claim'}`, {
            timeDiff,
        })}
    >
        <div class="flex flex-row items-center gap-1">
            <Icon name={IconName.Hourglass} size="xxs" customColor="warning" />
            {timeDiff}
        </div>
    </Pill>
{/if}
