<script lang="ts">
    import { Avatar, IconName, Text, Tile, Toggle } from '@bloomwalletio/ui'

    export let checked = true
    export let title: string
    export let subTitle: string
    export let iconName: IconName | undefined
    export let iconColor: string | undefined
    export let backgroundColor: string = `${iconColor ?? 'secondary'}-200`
    export let onClick: () => void | undefined = undefined
</script>

<Tile>
    <status-tile>
        <div class="flex flex-row items-center gap-2">
            <Avatar icon={iconName} {backgroundColor} textColor={iconColor} size="sm" shape="square" />
            <div>
                <Text>{title}</Text>
                <Text type="xs" color="secondary">{subTitle}</Text>
            </div>
        </div>
        {#if onClick}
            <Toggle {onClick} label="status" {checked} size="sm" border="rounded-full" />
        {/if}
    </status-tile>
</Tile>

<style lang="postcss">
    status-tile {
        @apply flex justify-between items-center;
        @apply w-full h-9;
    }
</style>
