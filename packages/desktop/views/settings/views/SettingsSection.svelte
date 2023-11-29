<script lang="ts">
    import { Text } from '@bloomwalletio/ui'

    export let title: string
    export let description: string | undefined = undefined
</script>

<settings-section>
    <Text type="body2" class="mb-{description ? 2 : 6}">{title}</Text>
    {#if description}
        <Text type="base" textColor="secondary" class="mb-6">{description}</Text>
    {/if}
    <slot />
</settings-section>
