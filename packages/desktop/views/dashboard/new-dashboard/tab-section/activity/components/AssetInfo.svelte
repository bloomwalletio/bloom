<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let title: string
    export let subtitle: string
</script>

<slot />
<div class="flex flex-col items-start justify-between">
    <Text>
        {title}
    </Text>
    <Text type="sm" color="secondary">
        {subtitle}
    </Text>
</div>
