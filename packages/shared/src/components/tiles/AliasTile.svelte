<script lang="ts">
    import { setClipboard, truncateString } from '@core/utils'
    import { Text, IconName, Avatar, Tile } from '@bloomwalletio/ui'

    export let aliasId: string
    export let fullWidth = true

    function onTileClick(): void {
        setClipboard(aliasId, true)
    }
</script>

<Tile onClick={onTileClick}>
    <div class="w-full flex flex-row items-center text-left space-x-4">
        <Avatar icon={IconName.Alias} size="lg" textColor="brand" backgroundColor="surface-2" />

        <div class="flex flex-col overflow-hidden">
            <Text truncate>Alias</Text>
            <Text textColor="secondary" fontWeight="medium" truncate>
                {fullWidth ? aliasId : truncateString(aliasId, 7, 7)}
            </Text>
        </div>
    </div>
</Tile>
