<script lang="ts">
    import { localize } from '@core/i18n'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'

    export let timeDiff: string
</script>

<Pill color="neutral" compact>
    <div class="flex flex-row items-center gap-1">
        <Icon name={IconName.Locked} size="xxs" customColor="neutral" />
        {localize('pills.asyncStatus.timelocked', { timeDiff })}
    </div>
</Pill>
