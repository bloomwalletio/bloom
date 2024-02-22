<script lang="ts">
    import { Pill, Color } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkHealth } from '@core/network'
    import { NetworkStatusIndicator } from '@ui'

    export let status: NetworkHealth

    const COLORS: { [key: string]: Color } = {
        [NetworkHealth.Operational]: 'green',
        [NetworkHealth.Degraded]: 'yellow',
        [NetworkHealth.Disconnected]: 'orange',
    }
</script>

<Pill color={COLORS[status]}>
    <div class="flex flex-row space-x-1 items-center">
        <NetworkStatusIndicator {status} size="sm" />
        <div>
            {localize(`pills.networkHealth.${status}`)}
        </div>
    </div>
</Pill>
