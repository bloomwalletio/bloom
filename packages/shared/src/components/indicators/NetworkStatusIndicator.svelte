<script lang="ts">
    import type { DefaultColors } from 'tailwindcss/types/generated/colors'
    import { Indicator } from '@bloomwalletio/ui'
    import { NetworkHealth } from '@core/network'

    export let status: NetworkHealth
    export let size: 'sm' | 'md' | 'lg' = 'sm'
    export let disablePing: boolean = false

    let color: keyof DefaultColors = 'orange'
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
                color = 'orange'
                ping = false
                break
        }
    }
</script>

<Indicator {color} ping={!disablePing && ping} {size} />
