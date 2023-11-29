<script lang="ts">
    import { DefaultColors } from 'tailwindcss/types/generated/colors'
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkHealth } from '@core/network'
    import { NetworkStatusIndicator } from '@ui'

    export let status: NetworkHealth

    let color: keyof DefaultColors | 'primary' = 'primary'
    $: {
        switch (status) {
            case NetworkHealth.Operational:
                color = 'green'
                break
            case NetworkHealth.Degraded:
                color = 'yellow'
                break
            case NetworkHealth.Disconnected:
            case NetworkHealth.Down:
                color = 'orange'
                break
        }
    }
</script>

<Pill {color}>
    <div class="flex flex-row space-x-1 items-center">
        <NetworkStatusIndicator {status} size="sm" />
        <div>
            {localize(`pills.networkHealth.${status}`)}
        </div>
    </div>
</Pill>
