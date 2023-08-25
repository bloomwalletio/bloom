<script lang="ts">
    import { Indicator, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DefaultColors } from 'tailwindcss/types/generated/colors'

    export let active: boolean

    $: color = active ? 'green' : ('orange' as keyof DefaultColors)
    $: localizeKey = active ? 'connected' : 'disconnected'
</script>

<Pill {color}>
    <div class="flex flex-row space-x-1 items-center">
        <Indicator {color} ping={active} size="sm" />
        <div>
            {localize(`general.${localizeKey}`)}
        </div>
    </div>
</Pill>
