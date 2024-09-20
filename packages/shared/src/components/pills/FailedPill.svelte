<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { Activity } from '@core/activity'
    import { localize } from '@core/i18n'

    export let activity: Activity

    let tooltip = ''

    async function onHover(): Promise<void> {
        // tooltip = activity.errorMessage
    }
</script>

<div role="contentinfo" on:focus={onHover} on:mouseover={onHover} class="capitalize">
    <Pill color="danger" compact tooltipEvent="hover" {tooltip}>
        {localize('general.failed')}
    </Pill>
</div>
