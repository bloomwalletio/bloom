<script lang="ts">
    import { Pill, Indicator } from '@bloomwalletio/ui'
    import { NetworkHealth } from '@core/network'
    import { localize } from '@core/i18n'

    export let status: NetworkHealth

    let color: string = 'primary'
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
        c
    }
</script>

<Pill {color}>
    <div class="flex flex-row space-x-1 items-center">
        <Indicator {color} {ping} />
        <div>
            {localize(`pills.networkHealth.${status}`)}
        </div>
    </div>
</Pill>
