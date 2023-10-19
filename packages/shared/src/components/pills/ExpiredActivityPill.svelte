<script lang="ts">
    import { localize } from '@core/i18n'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
</script>

<Pill color="neutral" compact>
    <div class="flex flex-row items-center gap-1">
        <Icon name={IconName.EmptyHourglass} size="xxs" customColor="neutral" />
        {localize('pills.asyncStatus.expired')}
    </div>
</Pill>
