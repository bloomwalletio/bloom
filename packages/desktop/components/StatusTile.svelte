<script lang="ts">
    import { Icon, IconName, Text, Tile, Toggle } from '@bloomwalletio/ui'

    export let checked = true
    export let title: string = 'Title'
    export let subTitle: string = 'Subtitle'
    export let iconName: IconName | undefined
    export let iconColor: string | undefined
</script>

<Tile>
    <status-tile>
        <div class="flex flex-row items-center">
            <Icon name={iconName} color={iconColor} />
            <div>
                <Text>{title}</Text>
                <Text>{subTitle}</Text>
            </div>
        </div>
        <Toggle label="status" {checked} size="sm" border="rounded-full" />
    </status-tile>
</Tile>

<style lang="postcss">
    status-tile {
        @apply flex justify-between items-center;
        @apply w-full h-9;
    }
</style>
