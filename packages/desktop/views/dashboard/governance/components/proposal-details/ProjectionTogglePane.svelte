<script lang="ts">
    import { Pane } from '@ui'
    import { IconName, Text, Toggle, TooltipIcon } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let checked: boolean = false
</script>

<Pane surface="1" classes="flex items-center justify-between h-fit shrink-0 p-4">
    <div class="flex flex-col">
        <div class="flex items-center gap-1">
            <Text>{localize('views.governance.details.projection.title')}</Text>
            <TooltipIcon icon={IconName.InfoCircle} tooltip={localize('views.governance.details.projection.tooltip')} />
        </div>
    </div>
    <Toggle label="" bind:checked />
</Pane>
