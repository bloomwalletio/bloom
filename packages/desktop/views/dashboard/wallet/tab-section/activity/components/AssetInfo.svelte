<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let title: string
    export let subtitle: string
</script>

<div class="flex flex-row gap-4 items-center">
    <slot />
    <div class="flex flex-col items-start justify-between">
        <Text>
            {title}
        </Text>
        <Text type="sm" textColor="secondary">
            {subtitle}
        </Text>
    </div>
</div>
