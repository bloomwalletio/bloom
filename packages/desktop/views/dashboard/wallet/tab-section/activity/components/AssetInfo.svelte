<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let title: string
    export let subtitle: string
</script>

<div class="flex flex-row gap-4">
    <slot />
    <div class="flex flex-col items-start justify-between">
        <Text>
            {title}
        </Text>
        <Text type="sm" color="secondary" darkColor="secondary">
            {subtitle}
        </Text>
    </div>
</div>
