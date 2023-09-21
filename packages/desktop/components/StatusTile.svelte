<script lang="ts">
    import { Avatar, IconName, Text, Tile, Toggle } from '@bloomwalletio/ui'

    export let checked = true
    export let title: string
    export let subTitle: string
    export let iconName: IconName | undefined
    export let iconColor: string | undefined
    export let onClick: () => void
</script>

<Tile>
    <status-tile>
        <div class="flex flex-row items-center gap-2">
            <Avatar
                icon={iconName}
                backgroundColor="{iconColor}-100"
                textColor={iconColor}
                size="sm"
                shape="squircle"
            />
            <div>
                <Text type="base-md">{title}</Text>
                <Text type="sm-md" color="gray-500">{subTitle}</Text>
            </div>
        </div>
        {#if onClick}
            <Toggle on:click={onClick} label="status" {checked} size="sm" border="rounded-full" />
        {/if}
    </status-tile>
</Tile>

<style lang="postcss">
    status-tile {
        @apply flex justify-between items-center;
        @apply w-full h-9;
    }
</style>
