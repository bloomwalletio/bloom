<script lang="ts">
    import { localize } from '@core/i18n'
    import { ActivityDirection } from '@core/activity'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'

    export let direction: ActivityDirection
    export let timeDiff: string
</script>

<Pill color="warning" compact>
    <div class="flex flex-row items-center gap-1">
        <Icon name={IconName.Hourglass} size="xxs" customColor="warning" />
        {localize(`pills.asyncStatus.${direction === ActivityDirection.Outgoing ? 'unclaimed' : 'claim'}`, {
            timeDiff,
        })}
    </div>
</Pill>
