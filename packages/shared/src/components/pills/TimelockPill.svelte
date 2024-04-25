<script lang="ts">
    import { localize } from '@core/i18n'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'

    export let timeDiff: string
</script>

{#if timeDiff !== ''}
    <Pill color="indigo" compact tooltip={localize('pills.asyncStatus.timelocked', { timeDiff })}>
        <div class="flex flex-row items-center gap-1">
            <Icon name={IconName.Locked} size="xxs" customColor="indigo" />
            {timeDiff}
        </div>
    </Pill>
{/if}
