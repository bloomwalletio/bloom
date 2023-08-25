<script lang="ts">
    import { DefaultColors } from 'tailwindcss/types/generated/colors'
    import { Indicator, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkHealth } from '@core/network'

    export let status: NetworkHealth

    let color: keyof DefaultColors | 'primary' = 'primary'
    let ping = false
    $: {
        switch (status) {
            case NetworkHealth.Operational:
                color = 'green'
                ping = true
                break
            case NetworkHealth.Degraded:
                color = 'yellow'
                ping = false
                break
            case NetworkHealth.Disconnected:
            case NetworkHealth.Down:
                color = 'orange'
                ping = false
                break
        }
    }
</script>

<Pill {color}>
    <div class="flex flex-row space-x-1 items-center">
        <Indicator {color} {ping} size="sm" />
        <div>
            {localize(`pills.networkHealth.${status}`)}
        </div>
    </div>
</Pill>
