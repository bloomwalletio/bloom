<script lang="ts">
    import { FontWeight, Text } from '@ui'

    export let title: string
    export let subtitle: string
</script>

<slot />
<div class="flex flex-col items-start justify-between">
    <Text fontWeight={FontWeight.semibold}>
        {title}
    </Text>
    <Text fontWeight={FontWeight.semibold} secondary>
        {subtitle}
    </Text>
</div>
