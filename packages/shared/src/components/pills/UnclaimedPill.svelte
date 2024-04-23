<script lang="ts">
    import { Icon, IconName, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let timeDiff: string | undefined = undefined
</script>

<Pill color="warning" compact tooltip={localize('pills.asyncStatus.unclaimed', { timeDiff: timeDiff })}>
    <div class="flex flex-row items-center gap-1">
        <Icon name={IconName.Hourglass} size="xxs" customColor="warning" />
        {timeDiff ? timeDiff : localize('pills.asyncStatus.unclaimed', { timeDiff: undefined })}
    </div>
</Pill>
